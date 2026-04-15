import type { MetadataRoute } from 'next';

const BASE = 'https://tunixlabs.com';
const LOCALES = ['es', 'en'] as const;
const PATHS = ['/inicio', '/contacto', '/v3'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return LOCALES.flatMap(locale =>
    PATHS.map(path => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );
}
