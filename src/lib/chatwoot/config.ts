/**
 * Chatwoot headless config — base URL, website token (aka inbox_identifier),
 * and ActionCable WebSocket URL. Token is safe to expose client-side: it's the
 * public website token meant for the in-browser widget.
 */
export const CHATWOOT = {
  baseUrl: 'https://app.chatwoot.com',
  websiteToken: '295pYkAcDUvzEiURvTzGQ8di',
  cableUrl: 'wss://app.chatwoot.com/cable',
} as const;

export const STORAGE_KEY = 'tunix_chat_v1';
