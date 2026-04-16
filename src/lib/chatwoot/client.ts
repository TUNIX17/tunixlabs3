/**
 * Chatwoot Public Client API — HTTP fetchers.
 * Endpoints verified against github.com/chatwoot/client-api-demo.
 */
import { CHATWOOT } from './config';

export class ChatwootError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ChatwootError';
    this.status = status;
  }
}

export type ChatwootMessage = {
  id: number;
  content: string;
  /** 0 = incoming (from customer), 1 = outgoing (from agent), 2 = activity, 3 = template */
  message_type: 0 | 1 | 2 | 3;
  /** unix seconds */
  created_at: number;
  sender?: { name?: string; thumbnail?: string; type?: string };
  conversation_id?: number;
};

export type ChatwootContactResponse = {
  source_id: string;
  pubsub_token: string;
  id?: number;
  name?: string;
};

type ConversationResponse = { id: number };

const BACKOFF_MS = [500, 1500, 4000];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${CHATWOOT.baseUrl}${path}`;
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt <= BACKOFF_MS.length; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
      });
      if (!res.ok) {
        throw new ChatwootError(`Chatwoot ${res.status} on ${path}`, res.status);
      }
      const body = await res.text();
      return body ? (JSON.parse(body) as T) : (undefined as T);
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      // Do not retry 4xx except 429
      if (err instanceof ChatwootError && err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
        throw err;
      }
      if (attempt === BACKOFF_MS.length) break;
      await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt]));
    }
  }
  throw lastErr ?? new ChatwootError('Unknown Chatwoot error');
}

export function createContact(): Promise<ChatwootContactResponse> {
  return request<ChatwootContactResponse>(
    `/public/api/v1/inboxes/${CHATWOOT.websiteToken}/contacts`,
    { method: 'POST', body: '{}' }
  );
}

export function createConversation(sourceId: string): Promise<ConversationResponse> {
  return request<ConversationResponse>(
    `/public/api/v1/inboxes/${CHATWOOT.websiteToken}/contacts/${sourceId}/conversations`,
    { method: 'POST', body: '{}' }
  );
}

export function sendMessage(
  sourceId: string,
  conversationId: number,
  content: string
): Promise<ChatwootMessage> {
  return request<ChatwootMessage>(
    `/public/api/v1/inboxes/${CHATWOOT.websiteToken}/contacts/${sourceId}/conversations/${conversationId}/messages`,
    { method: 'POST', body: JSON.stringify({ content }) }
  );
}

export function listMessages(
  sourceId: string,
  conversationId: number
): Promise<ChatwootMessage[]> {
  return request<ChatwootMessage[]>(
    `/public/api/v1/inboxes/${CHATWOOT.websiteToken}/contacts/${sourceId}/conversations/${conversationId}/messages`
  );
}
