import type { MetadataRoute } from 'next';
import { CASES } from '@/lib/cases-data';
import { SERVICES } from '@/lib/services';

const BASE = 'https://tunixlabs.com';
const LOCALES = ['es', 'en'] as const;

type Locale = (typeof LOCALES)[number];

// ES→EN path segment aliases mirroring src/i18n/routing.ts pathnames.
const EN_ALIASES: Record<string, string> = {
  '/inicio': '/home',
  '/contacto': '/contact',
  '/sobre': '/about',
  '/casos': '/cases',
  '/servicios': '/services',
  '/v3': '/v3',
};

function localizedPath(esPath: string, locale: Locale): string {
  if (locale === 'es') return esPath;
  return EN_ALIASES[esPath] ?? esPath;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = LOCALES.flatMap(locale => {
    const out: MetadataRoute.Sitemap = [];

    // Static pages per locale (inicio/home, contacto/contact, v3).
    const staticEntries: Array<{ es: string; priority: number }> = [
      { es: '/inicio', priority: 1.0 },
      { es: '/contacto', priority: 0.6 },
      { es: '/v3', priority: 0.6 },
    ];
    for (const s of staticEntries) {
      out.push({
        url: `${BASE}/${locale}${localizedPath(s.es, locale)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: s.priority,
      });
    }

    // Cases: /{locale}/(casos|cases)/{slug}
    const casesPrefix = localizedPath('/casos', locale);
    for (const c of CASES) {
      out.push({
        url: `${BASE}/${locale}${casesPrefix}/${c.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Services: /{locale}/(servicios|services)/{slug}
    const servicesPrefix = localizedPath('/servicios', locale);
    for (const s of SERVICES) {
      out.push({
        url: `${BASE}/${locale}${servicesPrefix}/${s.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // About: /{locale}/(sobre|about)
    out.push({
      url: `${BASE}/${locale}${localizedPath('/sobre', locale)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    });

    return out;
  });

  // Expected: 2 locales × (3 static + 7 cases + 7 services + 1 about) = 36.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`[sitemap] generated ${entries.length} URLs`);
  }

  return entries;
}
