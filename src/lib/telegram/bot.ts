/**
 * Minimal Telegram Bot API wrapper.
 *
 * We only need two operations: sendMessage (outbound notifications) and
 * setWebhook (one-time bootstrap, invoked by a setup script rather than
 * runtime code). Keep the surface tiny — there's no node-telegram-bot-api
 * dependency, just fetch.
 *
 * Env vars:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_OWNER_CHAT_ID
 */
const BASE = 'https://api.telegram.org';

export class TelegramError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TelegramError';
    this.status = status;
  }
}

export type TelegramUpdate = {
  update_id: number;
  message?: {
    message_id: number;
    from?: { id: number; first_name?: string; username?: string };
    chat: { id: number };
    text?: string;
    date: number;
    reply_to_message?: {
      message_id: number;
      text?: string;
      from?: { id: number; is_bot?: boolean };
    };
  };
};

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new TelegramError('Missing TELEGRAM_BOT_TOKEN env var');
  return token;
}

export function getOwnerChatId(): number {
  const raw = process.env.TELEGRAM_OWNER_CHAT_ID;
  if (!raw) throw new TelegramError('Missing TELEGRAM_OWNER_CHAT_ID env var');
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new TelegramError('TELEGRAM_OWNER_CHAT_ID is not a number');
  return n;
}

export async function sendMessage(
  chatId: number | string,
  text: string,
  options?: { disable_notification?: boolean; parse_mode?: 'Markdown' | 'HTML' | 'MarkdownV2' }
): Promise<void> {
  const token = getToken();
  const res = await fetch(`${BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, ...options }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new TelegramError(
      `Telegram sendMessage ${res.status}: ${body.slice(0, 200)}`,
      res.status
    );
  }
}

/**
 * Extract a conversation id from the text of a forwarded notification.
 * Our outbound notifications always start with "💬 Web #<id> · ...", so a
 * Telegram "reply to message" gives us the conv id for free — the owner
 * just replies naturally without typing any prefix.
 */
export function extractConversationIdFromNotificationText(
  text: string | undefined | null
): number | null {
  if (!text) return null;
  const match = text.match(/Web #(\d+)/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * Resolve the target conversation id for an owner message.
 *
 * Priority (most natural first):
 *   1. Telegram "reply to message" → parse the quoted bot notification for `Web #<id>`
 *   2. Explicit `@<id> <content>` prefix in the message text (fallback for old flow)
 *
 * Returns `{ conversationId, content }` or null if we couldn't tell.
 */
export function resolveOwnerReply(message: {
  text?: string;
  reply_to_message?: { text?: string };
}): { conversationId: number; content: string } | null {
  const raw = (message.text ?? '').trim();
  if (!raw) return null;

  // 1. Reply to a bot notification — the quoted text contains `Web #<id>`.
  if (message.reply_to_message?.text) {
    const convId = extractConversationIdFromNotificationText(
      message.reply_to_message.text
    );
    if (convId) {
      return { conversationId: convId, content: raw };
    }
  }

  // 2. Explicit `@<id> <content>` prefix (legacy/override).
  const match = raw.match(/^@(\d+)\s+([\s\S]+)$/);
  if (match) {
    const conversationId = parseInt(match[1], 10);
    const content = match[2].trim();
    if (Number.isFinite(conversationId) && content) {
      return { conversationId, content };
    }
  }

  return null;
}
