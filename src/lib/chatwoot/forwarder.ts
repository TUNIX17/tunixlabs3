/**
 * Shared "forward visitor message to Telegram" logic with in-memory dedupe.
 *
 * Both the webhook path (/api/chat/chatwoot-webhook) and the polling path
 * (lib/chatwoot/poller.ts) funnel through here so we never double-notify.
 * Dedup is keyed by Chatwoot message id; the Set is trimmed when it grows
 * past a watermark.
 */
import { sendMessage, getOwnerChatId, TelegramError } from '@/lib/telegram/bot';
// Importing the poller eagerly ensures the module's side-effect kicks off
// the setInterval on first import (i.e. when the first chat-related API
// route runs). This is more reliable on Next.js 13.5 than the experimental
// instrumentation hook, which was silently not firing on our deployment.
import '@/lib/chatwoot/poller';

const processed = new Set<number>();
const WATERMARK = 5000;
const TRIM_TO = 2500;

export function isProcessed(messageId: number): boolean {
  return processed.has(messageId);
}

export function markProcessed(messageId: number): void {
  processed.add(messageId);
  if (processed.size > WATERMARK) {
    const arr = Array.from(processed);
    processed.clear();
    arr.slice(-TRIM_TO).forEach((id) => processed.add(id));
  }
}

export type ForwardInput = {
  messageId: number;
  conversationId: number;
  content: string;
  senderName: string;
  senderPhone?: string | null;
  senderIdentifier?: string | null;
  source: 'webhook' | 'poll';
};

// Contacts from Evolution (WhatsApp) carry a JID-style identifier like
// "56912345678@s.whatsapp.net" (DM) or "...@g.us" (group). Web visitors
// from <TerminalChat> are anonymous and carry neither a phone nor a JID.
function isWhatsAppSender(
  phone?: string | null,
  identifier?: string | null
): boolean {
  if (phone && phone.trim().length > 0) return true;
  if (identifier && /@(s\.whatsapp\.net|g\.us|c\.us|broadcast|lid)/i.test(identifier)) {
    return true;
  }
  return false;
}

/**
 * Forward a visitor message to the owner's Telegram chat. Safe to call
 * multiple times for the same message — only the first call actually sends.
 * Returns true if forwarded, false if deduped, filtered, or failed.
 */
export async function forwardVisitorMessage(
  input: ForwardInput
): Promise<{ forwarded: boolean; reason?: string }> {
  // Hard filter: the Chatwoot inbox is shared with the Evolution API
  // (WhatsApp) bridge. Anything with a phone number or a WhatsApp JID is
  // NOT a web visitor and must not be forwarded to Telegram. This is the
  // last line of defense — callers should also filter upstream.
  if (isWhatsAppSender(input.senderPhone, input.senderIdentifier)) {
    return { forwarded: false, reason: 'whatsapp_sender' };
  }

  if (isProcessed(input.messageId)) {
    return { forwarded: false, reason: 'already_processed' };
  }
  // Mark immediately to close the race between concurrent webhook + poll.
  markProcessed(input.messageId);

  const text =
    `💬 Web #${input.conversationId} · ${input.senderName}\n\n` +
    `${input.content}\n\n` +
    `↳ Responde a este mensaje para contestar`;

  try {
    await sendMessage(getOwnerChatId(), text);
    console.log(
      `[forwarder] sent msg #${input.messageId} conv #${input.conversationId} via ${input.source}`
    );
    return { forwarded: true };
  } catch (e) {
    const msg = e instanceof TelegramError ? e.message : String(e);
    console.error(
      `[forwarder] telegram send failed for msg #${input.messageId}:`,
      msg
    );
    // Roll back dedupe so a retry path can try again.
    processed.delete(input.messageId);
    return { forwarded: false, reason: msg };
  }
}
