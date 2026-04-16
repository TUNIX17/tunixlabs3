/**
 * Plausible analytics tracking helper.
 *
 * Design:
 * - SSR-safe: the `typeof window` guard lets this be imported from any file
 *   (including server components) without exploding.
 * - No-op when the script is not loaded: during local dev (no
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN) the Plausible script is not injected and
 *   `window.plausible` is undefined — `trackEvent` silently does nothing.
 * - Centralized event catalog: the `Events` const is the single source of
 *   truth for funnel event names. Always import from there instead of
 *   hardcoding strings, so renames stay consistent and typos break builds.
 */

type PlausibleEventProps = Record<string, string | number | boolean>;

export function trackEvent(name: string, props?: PlausibleEventProps): void {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  window.plausible(name, props ? { props } : undefined);
}

/**
 * Canonical event names for the Tunixlabs conversion funnel.
 *
 * When adding a new event:
 * 1. Add the constant here with a descriptive "Category: Action" name.
 * 2. Call `trackEvent(Events.YOUR_EVENT, { ...optionalProps })` at the call
 *    site.
 * 3. Add the event to the "Events" list in `docs/ANALYTICS.md`.
 */
export const Events = {
  // CTAs — top of funnel
  CTA_WHATSAPP_CLICK: 'CTA: WhatsApp Click',
  CTA_EMAIL_CLICK: 'CTA: Email Click',
  CTA_FULL_FORM_CLICK: 'CTA: Full Form Click',

  // Content engagement — home + service pages
  SERVICE_CARD_CLICK: 'Service Card Click',
  CASE_STUDY_CLICK: 'Case Study Click',
  PAGE_VIEW_SERVICE: 'Page View: Service',
  SCROLL_DEPTH: 'Scroll Depth',
  TIME_ON_PAGE_BUCKET: 'Time on Page',
  HERO_CTA_VISIBLE: 'Hero CTA Visible',
  LOCALE_SWITCH: 'Locale Switch',

  // Credentials — MIT diploma modal
  DIPLOMA_VIEW: 'Credential: MIT Diploma View',
  DIPLOMA_CLOSE: 'Credential: MIT Diploma Close',

  // Contact form — bottom of funnel
  CONTACT_FORM_SUBMIT: 'Contact Form Submit',
  CONTACT_FORM_SUCCESS: 'Contact Form Success',
  CONTACT_FORM_ERROR: 'Contact Form Error',
  FORM_FIELD_BLUR: 'Form Field Blur',
  FORM_ABANDON: 'Form Abandon',

  // Terminal Chat (headless Chatwoot)
  CHAT_TERMINAL_OPEN: 'Chat Terminal: Open',
  CHAT_TERMINAL_MESSAGE_SENT: 'Chat Terminal: Message Sent',
  CHAT_TERMINAL_AGENT_REPLY: 'Chat Terminal: Agent Reply',
  CHAT_INIT_ERROR: 'Chat Terminal: Init Error',
} as const;

export type EventName = (typeof Events)[keyof typeof Events];
