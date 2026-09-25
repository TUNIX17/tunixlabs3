import { routing, type Locale, type Pathnames } from '@/i18n/routing';

export const SITE_URL = 'https://tunixlabs.com';

export function toLocale(value: string): Locale {
  return routing.locales.includes(value as Locale) ? (value as Locale) : routing.defaultLocale;
}

/**
 * Public URL path for an internal pathname, taken from `routing.pathnames`
 * so EN pages get their localized slug (`/en/services/rpa`, not the
 * `/en/servicios/rpa` redirect). Dynamic keys keep their `[param]`
 * placeholder for the caller to fill.
 */
export function localizedPath(locale: Locale, pathname: Pathnames): string {
  const entry = routing.pathnames[pathname];
  const path = typeof entry === 'string' ? entry : entry[locale];
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * `alternates` for generateMetadata: self-referencing canonical plus
 * hreflang for every locale. Each page must set its own — the locale
 * layout sets none, so a page without it inherits no canonical instead
 * of the home's.
 */
export function alternatesFor(locale: Locale, pathname: Pathnames) {
  return {
    canonical: localizedPath(locale, pathname),
    languages: {
      es: localizedPath('es', pathname),
      en: localizedPath('en', pathname),
      'x-default': localizedPath(routing.defaultLocale, pathname),
    },
  };
}
