/**
 * Chatwoot headless config.
 *
 * `inboxIdentifier` is the API Channel token shown under Inbox → Configuration
 * → "Inbox Identifier" (NOT the Website widget token — those point to a
 * different Channel type and return 404 on /public/api/v1/...).
 *
 * Currently reusing the "WhatsApp Tunix" API Channel inbox (shared with the
 * Evolution API bridge). Website conversations will appear in the same inbox
 * as WhatsApp ones but with anonymous "Visitor #xxxx" contacts (no phone).
 * If this gets noisy, create a dedicated API Channel inbox and swap the
 * identifier here.
 *
 * Safe to expose client-side: this token only authorizes creating anonymous
 * contacts + messages on this inbox. No admin privileges.
 */
export const CHATWOOT = {
  baseUrl: 'https://app.chatwoot.com',
  inboxIdentifier: 'fJuFXLdtPXvjGQyLHubQ5mKT',
  cableUrl: 'wss://app.chatwoot.com/cable',
} as const;

export const STORAGE_KEY = 'tunix_chat_v1';
