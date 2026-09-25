import type { MetadataRoute } from 'next';
import { routing, type Pathnames } from '@/i18n/routing';
import { CASES } from '@/lib/cases-data';
import { SITE_URL, localizedPath } from '@/lib/seo/alternates';

// `/` only redirects to `/inicio`; `[slug]` pages are listed per case below.
const PAGES = (Object.keys(routing.pathnames) as Pathnames[]).filter(
  (pathname) => pathname !== '/' && !pathname.includes('[')
);

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => [
    ...PAGES.map((pathname) => ({ url: SITE_URL + localizedPath(locale, pathname) })),
    ...CASES.map((c) => ({
      url: SITE_URL + localizedPath(locale, '/casos/[slug]').replace('[slug]', c.slug),
    })),
  ]);
}
