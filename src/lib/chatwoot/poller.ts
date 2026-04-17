/**
 * Chatwoot admin API poller — failsafe for the flaky webhook delivery on
 * app.chatwoot.com hosted. Every `POLL_INTERVAL_MS` we list recent messages
 * in our inbox's open conversations and forward anything new (incoming,
 * never before processed) to Telegram.
 *
 * First run after boot primes a "baseline message id" so we skip the
 * historical backlog — we only want to forward messages that arrive AFTER
 * the server starts. Otherwise a cold restart would spam every old visitor
 * message into Telegram.
 *
 * Dedup with the webhook path is handled by the shared `forwardVisitorMessage`
 * Set, so whichever channel arrives first wins and the other is silently
 * skipped.
 *
 * To disable polling (e.g. debugging), set env CHATWOOT_POLL_DISABLED=true.
 */
import { CHATWOOT } from './config';
import { forwardVisitorMessage, markProcessed } from './forwarder';

const POLL_INTERVAL_MS = 12000;

type ConversationSummary = {
  id: number;
  inbox_id: number;
  meta?: { sender?: { name?: string } };
  last_non_activity_message?: { id?: number };
};

type AdminMessage = {
  id: number;
  content?: string;
  message_type: number; // 0 = incoming, 1 = outgoing (agent)
  created_at?: number;
  sender?: { name?: string };
};

let timer: ReturnType<typeof setInterval> | null = null;
let baselinePrimed = false;

function ensureEnv(): { token: string; accountId: string } | null {
  const token = process.env.CHATWOOT_API_TOKEN;
  const accountId = process.env.CHATWOOT_ACCOUNT_ID;
  if (!token || !accountId) return null;
  return { token, accountId };
}

async function listInboxConversations(): Promise<ConversationSummary[]> {
  const env = ensureEnv();
  if (!env) return [];
  const url = `${CHATWOOT.baseUrl}/api/v1/accounts/${env.accountId}/conversations?status=open&page=1`;
  const res = await fetch(url, {
    headers: { api_access_token: env.token },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`list conversations ${res.status}`);
  const data = await res.json();
  const all: ConversationSummary[] = data?.data?.payload ?? [];
  // Filter by inbox (we still want to poll all inboxes in the account if the
  // user eventually splits traffic, but right now we only want our own).
  // We don't have the numeric inbox_id hardcoded — we resolve it lazily via
  // a separate call if we ever need it. For now, accept all and rely on the
  // contact phone to differentiate (WhatsApp contacts have phone_number).
  return all;
}

async function listMessages(conversationId: number): Promise<AdminMessage[]> {
  const env = ensureEnv();
  if (!env) return [];
  const url = `${CHATWOOT.baseUrl}/api/v1/accounts/${env.accountId}/conversations/${conversationId}/messages`;
  const res = await fetch(url, {
    headers: { api_access_token: env.token },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`list messages ${res.status}`);
  const data = await res.json();
  return (data?.payload as AdminMessage[]) ?? [];
}

async function getConversationSenderName(convId: number): Promise<string> {
  try {
    const convs = await listInboxConversations();
    const c = convs.find((x) => x.id === convId);
    return c?.meta?.sender?.name || 'Visitor';
  } catch {
    return 'Visitor';
  }
}

async function primeBaseline(): Promise<void> {
  // Grab the most recent message ids across open conversations and mark
  // them as "already processed" so we don't spam Telegram with the backlog.
  const convs = await listInboxConversations();
  for (const conv of convs) {
    try {
      const messages = await listMessages(conv.id);
      for (const m of messages) {
        markProcessed(m.id);
      }
    } catch (e) {
      console.error('[poller] prime error for conv', conv.id, e);
    }
  }
  console.log('[poller] baseline primed');
}

async function pollOnce(): Promise<void> {
  const env = ensureEnv();
  if (!env) return;
  try {
    const convs = await listInboxConversations();
    for (const conv of convs) {
      let messages: AdminMessage[];
      try {
        messages = await listMessages(conv.id);
      } catch (e) {
        console.error('[poller] list messages fail conv', conv.id, e);
        continue;
      }
      // Oldest first so forwarded order matches visitor order
      const chrono = [...messages].sort((a, b) => a.id - b.id);
      for (const m of chrono) {
        if (m.message_type !== 0) continue; // only incoming
        if (!m.content) continue;
        const senderName = conv.meta?.sender?.name || m.sender?.name || 'Visitor';
        await forwardVisitorMessage({
          messageId: m.id,
          conversationId: conv.id,
          content: m.content,
          senderName,
          source: 'poll',
        });
      }
    }
  } catch (e) {
    console.error('[poller] poll tick error', e);
  }
}

export function startChatwootPolling(): void {
  if (timer) return;
  if (process.env.CHATWOOT_POLL_DISABLED === 'true') {
    console.log('[poller] disabled via CHATWOOT_POLL_DISABLED env');
    return;
  }
  if (!ensureEnv()) {
    console.log('[poller] skipping — Chatwoot env vars not set');
    return;
  }
  console.log(`[poller] starting Chatwoot poll every ${POLL_INTERVAL_MS}ms`);

  // Prime baseline, THEN start ticking. If priming fails, still start
  // ticking — a bit of initial noise is better than no polling at all.
  void primeBaseline()
    .catch((e) => console.error('[poller] prime top-level', e))
    .finally(() => {
      baselinePrimed = true;
      timer = setInterval(() => {
        void pollOnce();
      }, POLL_INTERVAL_MS);
    });
}

export function stopChatwootPolling(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// Tiny health-check for an optional admin endpoint
export function pollerStatus() {
  return { running: !!timer, baselinePrimed, intervalMs: POLL_INTERVAL_MS };
}
