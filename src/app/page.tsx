import { redirect } from 'next/navigation';

/**
 * Defensive fallback: in normal runtime the `next-intl` middleware
 * (src/middleware.ts) intercepts `/` and routes to the correct locale
 * via CF-IPCountry or Accept-Language, so this file is never reached.
 * It exists as a safety net for edge cases (static export, CDN-cached
 * root, middleware misconfiguration). Redirect to `/es` (not
 * `/es/inicio`) and let next-intl's `pathnames` map resolve the
 * locale-specific path, so changes to `pathnames` don't break this file.
 */
export default function RootPage() {
  redirect('/es');
}
