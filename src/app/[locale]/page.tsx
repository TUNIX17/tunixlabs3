import { redirect } from '@/i18n/navigation';
import type { Pathnames } from '@/i18n/routing';
import { routing } from '@/i18n/routing';

/**
 * Locale root page — redirects `/:locale` to the canonical landing page
 * for that locale. The previous version hardcoded `locale: 'es'`, which
 * silently kicked every EN visitor back to the Spanish site regardless of
 * how they arrived (direct link, language switcher, browser Accept-Language).
 * That was the "EN doesn't work" bug reported on 2026-04-08.
 *
 * This version reads the incoming `params.locale` and passes it through to
 * `redirect()`, so `/es` goes to `/es/inicio` and `/en` goes to `/en/home`
 * (the localized URL for the same internal `/inicio` page). The internal
 * href is always the canonical `/inicio` because next-intl resolves it to
 * the right localized slug per-locale from `routing.ts`.
 */
type Props = {
  params: { locale: string };
};

export default function LocaleRootPage({ params: { locale } }: Props) {
  const safeLocale = routing.locales.includes(
    locale as typeof routing.locales[number]
  )
    ? (locale as typeof routing.locales[number])
    : routing.defaultLocale;
  redirect({ href: '/inicio' as Pathnames, locale: safeLocale });
}
