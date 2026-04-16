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
 * Parse an owner reply of the form "@<conversationId> <content...>".
 * Returns null if the message doesn't match (treat as noise — e.g. /start,
 * /help, a general note). Content can include newlines.
 */
export function parseConversationReply(
  text: string | undefined | null
): { conversationId: number; content: string } | null {
  if (!text) return null;
  const match = text.match(/^@(\d+)\s+([\s\S]+)$/);
  if (!match) return null;
  const conversationId = parseInt(match[1], 10);
  const content = match[2].trim();
  if (!Number.isFinite(conversationId) || !content) return null;
  return { conversationId, content };
}
