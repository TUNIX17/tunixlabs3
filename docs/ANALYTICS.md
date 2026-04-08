# Analytics — Plausible

This project uses [Plausible Analytics](https://plausible.io) to measure the
conversion funnel on `tunixlabs.com`. No other analytics stack (GA4, PostHog,
Mixpanel) is installed.

## Why Plausible (and not GA4)

- **Privacy-first**: no cookies, no cross-site tracking, no personal data
  collected. We do not need a GDPR cookie banner.
- **Lightweight**: the script is ~1 KB gzipped. GA4's `gtag.js` is ~50 KB and
  measurably hurts LCP on mobile.
- **No consent theatre**: because there are no cookies and no PII, we skip the
  "Accept all / Reject all" friction that kills conversion on a tiny marketing
  site.
- **Simple UI**: the Plausible dashboard is a single page, not a 12-level
  property/view/stream hierarchy.

Trade-off: Plausible does not do user-level cohort analysis or funnel
visualisation as richly as GA4. That is acceptable at 2k visits/month. When
the site hits ~50k/month we can reconsider.

## How to activate

1. Create an account at https://plausible.io and add `tunixlabs.com` as a
   site.
2. Copy the domain name (`tunixlabs.com`) and set it as the value of
   `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Railway (Production environment
   variables) and in any other deploy target. Local `.env.local` can leave it
   unset — the script is only injected when the variable is defined, so local
   development never hits Plausible servers.
3. Redeploy. The script tag is added to the `<head>` of every page through
   `src/app/[locale]/layout.tsx`.

Verification: open the site in an incognito window, open DevTools → Network,
filter by `plausible`, and confirm you see a request to
`https://plausible.io/api/event` on page load.

## Events catalog

All events are fired from `src/lib/analytics/track.ts` via the `trackEvent`
helper. The canonical names live in the `Events` const in the same file — do
not hardcode string names at the call site.

| Event                    | When it fires                                              | Props                   |
|--------------------------|------------------------------------------------------------|-------------------------|
| `CTA: WhatsApp Click`    | User clicks a WhatsApp CTA button                          | `{ location }`          |
| `CTA: Email Click`       | User clicks an email CTA button                            | `{ location }`          |
| `CTA: Full Form Click`   | User clicks through to the full contact form from a CTA   | `{ location }`          |
| `Service Card Click`     | User clicks a service card on the home page                | `{ service }`           |
| `Case Study Click`       | User clicks a case study card                              | `{ slug }`              |
| `Contact Form Submit`    | User presses the submit button on `/contacto`              | none                    |
| `Contact Form Success`   | `/api/contact` returns 2xx                                 | none                    |
| `Contact Form Error`     | `/api/contact` throws or returns non-2xx                   | `{ reason }`            |

The prop `location` is a short identifier of where on the site the CTA was
rendered (e.g. `"home"`, `"footer"`). The prop `reason` on
`Contact Form Error` is the human-readable error message so we can distinguish
validation failures from API outages in the dashboard.

## Adding a new event

1. Add the constant to `Events` in `src/lib/analytics/track.ts`.
2. Import `trackEvent` and `Events` from `@/lib/analytics/track` at the call
   site.
3. Call `trackEvent(Events.YOUR_EVENT, { ...optionalProps })`. The helper is
   SSR-safe and a no-op when the script has not loaded, so you can call it
   from any component without further guards.
4. Add a row to the "Events catalog" table above documenting when the event
   fires and what props it carries.

## SSR safety

`trackEvent` guards against `typeof window === 'undefined'` so it is safe to
import from server components. It is, however, still a client-side effect —
events will only fire once the component hydrates and the Plausible script
finishes loading. For server-rendered redirects or API-only flows, track the
event server-side via the Plausible Events API (not yet implemented).

## Do not add more analytics libraries

The point of Plausible is that it is the only analytics dependency. Resist
the urge to add PostHog for "just session replay" or GA4 for "just
demographics". Every script added to `<head>` costs LCP and adds a privacy
footnote. If a specific question cannot be answered by Plausible, write a
one-off instrumented event first and see if that is sufficient.
