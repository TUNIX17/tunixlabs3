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
  meta?: {
    sender?: {
      name?: string;
      phone_number?: string | null;
      identifier?: string | null;
    };
    channel?: string; // e.g. "Channel::Api", "Channel::Whatsapp"
  };
  last_non_activity_message?: { id?: number };
};

type AdminMessage = {
  id: number;
  content?: string;
  message_type: number; // 0 = incoming, 1 = outgoing (agent)
  created_at?: number;
  sender?: {
    name?: string;
    phone_number?: string | null;
    identifier?: string | null;
  };
};

/**
 * A conversation is considered "WhatsApp" (and therefore NOT a web visitor)
 * if the Chatwoot contact has a phone number, a WhatsApp JID identifier, or
 * the conversation channel is one of the WhatsApp providers. The
 * <TerminalChat> web visitor is anonymous and has none of these.
 */
function isWhatsAppConversation(conv: ConversationSummary): boolean {
  const phone = conv.meta?.sender?.phone_number;
  if (phone && phone.trim().length > 0) return true;
  const ident = conv.meta?.sender?.identifier;
  if (ident && /@(s\.whatsapp\.net|g\.us|c\.us|broadcast|lid)/i.test(ident)) {
    return true;
  }
  const channel = conv.meta?.channel;
  if (channel && /whatsapp/i.test(channel)) return true;
  return false;
}

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
  // We don't have the numeric web inbox_id hardcoded, so we accept all
  // conversations from the account here and filter downstream in pollOnce
  // via isWhatsAppConversation (WhatsApp contacts carry phone_number and/or
  // a JID identifier; anonymous web visitors carry neither). Long-term fix:
  // create a dedicated API Channel inbox for the web and filter by inbox_id.
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
      // Skip entire conversation if it's a WhatsApp contact — saves an
      // extra API call per tick and avoids flooding the forwarder's logs.
      if (isWhatsAppConversation(conv)) {
        continue;
      }
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
        const senderPhone =
          conv.meta?.sender?.phone_number ?? m.sender?.phone_number ?? null;
        const senderIdentifier =
          conv.meta?.sender?.identifier ?? m.sender?.identifier ?? null;
        await forwardVisitorMessage({
          messageId: m.id,
          conversationId: conv.id,
          content: m.content,
          senderName,
          senderPhone,
          senderIdentifier,
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

// Self-start when imported on a Node.js server runtime. Guard against
// accidental execution in non-Node contexts (Edge runtime, browser) and
// against running inside the `next build` phase (where server code is
// imported to collect metadata but should not start long-running timers).
if (
  typeof window === 'undefined' &&
  process.env.NEXT_RUNTIME !== 'edge' &&
  process.env.NEXT_PHASE !== 'phase-production-build'
) {
  startChatwootPolling();
}
