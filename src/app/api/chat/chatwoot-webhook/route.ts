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
import { CHATWOOT } from '@/lib/chatwoot/config';
import { sendMessage, getOwnerChatId, TelegramError } from '@/lib/telegram/bot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ChatwootWebhookPayload = {
  event?: string;
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
  let payload: ChatwootWebhookPayload;
  try {
    payload = await req.json();
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
  const content = (payload.content ?? '').trim();
  if (!conversationId || !content) {
    return Response.json({ ok: true, skipped: 'missing_fields' });
  }

  const senderName = payload.sender?.name || 'Visitor';
  const text =
    `💬 Web #${conversationId} · ${senderName}\n\n` +
    `${content}\n\n` +
    `Responde: @${conversationId} tu respuesta`;

  try {
    await sendMessage(getOwnerChatId(), text);
  } catch (e) {
    // Log but don't fail Chatwoot — it would retry and spam us
    const msg = e instanceof TelegramError ? e.message : String(e);
    console.error('[chatwoot-webhook] telegram send failed:', msg);
    return Response.json({ ok: true, forwarded: false, error: msg });
  }

  return Response.json({ ok: true, forwarded: true, conversationId });
}

// Chatwoot occasionally does a HEAD/GET probe when saving the webhook URL
export async function GET() {
  return Response.json({ ok: true, endpoint: 'chatwoot-webhook' });
}
