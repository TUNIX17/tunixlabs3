/**
 * Chatwoot Admin API wrapper.
 *
 * Used to POST messages as an agent (message_type=outgoing) in response to
 * visitor messages. Requires an API Access Token generated in Profile
 * Settings (not the inbox identifier). The token authorizes actions as that
 * specific agent — treat as a secret.
 *
 * Env vars (server-side only, never NEXT_PUBLIC_*):
 *   CHATWOOT_API_TOKEN
 *   CHATWOOT_ACCOUNT_ID
 */
import { CHATWOOT } from './config';

export class ChatwootAdminError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ChatwootAdminError';
    this.status = status;
  }
}

function getEnv(): { token: string; accountId: string } {
  const token = process.env.CHATWOOT_API_TOKEN;
  const accountId = process.env.CHATWOOT_ACCOUNT_ID;
  if (!token || !accountId) {
    throw new ChatwootAdminError(
      'Missing CHATWOOT_API_TOKEN or CHATWOOT_ACCOUNT_ID env var'
    );
  }
  return { token, accountId };
}

/**
 * Post a message as the agent that owns the API token.
 * message_type 'outgoing' = from agent (will appear as incoming in the UI
 * convention we use in TerminalChat).
 */
export async function postAgentMessage(
  conversationId: number,
  content: string
): Promise<{ id: number; content: string }> {
  const { token, accountId } = getEnv();
  const url = `${CHATWOOT.baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_access_token: token,
    },
    body: JSON.stringify({
      content,
      message_type: 'outgoing',
      private: false,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ChatwootAdminError(
      `Chatwoot admin POST ${res.status}: ${body.slice(0, 200)}`,
      res.status
    );
  }
  return res.json();
}

/**
 * Fetch a single conversation's metadata (used to verify a conv_id is valid
 * and belongs to our inbox before posting).
 */
export async function getConversation(
  conversationId: number
): Promise<{ id: number; inbox_id: number; status: string } | null> {
  const { token, accountId } = getEnv();
  const url = `${CHATWOOT.baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}`;
  const res = await fetch(url, {
    headers: { api_access_token: token },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ChatwootAdminError(
      `Chatwoot admin GET ${res.status}`,
      res.status
    );
  }
  return res.json();
}
