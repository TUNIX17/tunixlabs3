/**
 * Chatwoot webhook receiver.
 *
 * Chatwoot calls this endpoint when events fire on our account. We only act
 * on `message_created` events whose message_type is "incoming" (sent by the
 * visitor) and whose inbox is our TerminalChat inbox — everything else
 * (WhatsApp traffic handled by Evolution, outgoing messages we emitted
 * ourselves, notifications) is ignored to avoid loops and noise.
 *
 * When we match, we forward the message to Alejandro's Telegram as:
 *   💬 Web #<conv_id>  ·  <sender_name>
 *   <content>
 *
 *   Responde: @<conv_id> tu respuesta
 *
 * The ack response to Chatwoot is always 200 — Chatwoot retries 5xx, and a
 * Telegram hiccup shouldn't cause a retry storm.
 */
import type { NextRequest } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { CHATWOOT } from '@/lib/chatwoot/config';
import { forwardVisitorMessage } from '@/lib/chatwoot/forwarder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verify the Chatwoot webhook signature. Chatwoot signs the raw JSON body
 * with HMAC-SHA256(secret) and sends the hex digest in the
 * `X-Chatwoot-Signature` header. Returns true if the signature matches or
 * if no secret is configured (dev mode). Uses timingSafeEqual to avoid
 * timing attacks.
 */
function verifyChatwootSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.CHATWOOT_WEBHOOK_SECRET;
  if (!secret) return true; // not enforced when unset
  if (!signatureHeader) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signatureHeader, 'hex')
    );
  } catch {
    return false;
  }
}

type ChatwootWebhookPayload = {
  event?: string;
  id?: number; // message id (top-level in message_created events)
  message_type?: 'incoming' | 'outgoing' | 'activity' | 'template';
  content?: string;
  conversation?: {
    id?: number;
    inbox_id?: number;
    contact_inbox?: { inbox?: { identifier?: string } };
  };
  inbox?: { id?: number; identifier?: string };
  sender?: {
    name?: string;
    phone_number?: string | null;
    type?: string; // 'contact' | 'user' (agent) | 'agent_bot'
  };
};

export async function POST(req: NextRequest) {
  // Read raw body once so we can verify HMAC and then parse it.
  const rawBody = await req.text();

  const signature =
    req.headers.get('x-chatwoot-signature') ??
    req.headers.get('X-Chatwoot-Signature');
  if (!verifyChatwootSignature(rawBody, signature)) {
    return Response.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  let payload: ChatwootWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: true, skipped: 'invalid_json' });
  }

  // Only act on message_created events
  if (payload.event && payload.event !== 'message_created') {
    return Response.json({ ok: true, skipped: `event:${payload.event}` });
  }

  // Only act on incoming messages (from visitor). Outgoing = our own reply.
  if (payload.message_type !== 'incoming') {
    return Response.json({ ok: true, skipped: `message_type:${payload.message_type}` });
  }

  // Only forward messages whose sender is a `contact` (visitor). Agent/bot
  // messages that somehow arrive as incoming are ignored to avoid loops.
  if (payload.sender?.type && payload.sender.type !== 'contact') {
    return Response.json({ ok: true, skipped: `sender_type:${payload.sender.type}` });
  }

  // Filter by inbox — only forward messages from our TerminalChat inbox
  // (the same API Channel the Public Client API writes to).
  const inboxIdentifier =
    payload.conversation?.contact_inbox?.inbox?.identifier ??
    payload.inbox?.identifier;
  if (inboxIdentifier && inboxIdentifier !== CHATWOOT.inboxIdentifier) {
    return Response.json({ ok: true, skipped: `inbox:${inboxIdentifier}` });
  }

  const conversationId = payload.conversation?.id;
  const messageId = payload.id;
  const content = (payload.content ?? '').trim();
  if (!conversationId || !content || !messageId) {
    return Response.json({ ok: true, skipped: 'missing_fields' });
  }

  const result = await forwardVisitorMessage({
    messageId,
    conversationId,
    content,
    senderName: payload.sender?.name || 'Visitor',
    source: 'webhook',
  });

  return Response.json({ ok: true, ...result, conversationId });
}

// Chatwoot occasionally does a HEAD/GET probe when saving the webhook URL
export async function GET() {
  return Response.json({ ok: true, endpoint: 'chatwoot-webhook' });
}
