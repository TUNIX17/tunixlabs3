// Tunix Labs — 7 production services.
// Slugs match physical route subdirectories under src/app/[locale]/servicios/.
// Used by sitemap.ts to enumerate service URLs for both locales.

export interface Service {
  slug: string;
}

export const SERVICES: Service[] = [
  { slug: 'asistentes-ia' },
  { slug: 'business-intelligence' },
  { slug: 'consultoria-ia' },
  { slug: 'desarrollos-web' },
  { slug: 'machine-learning' },
  { slug: 'rpa' },
  { slug: 'vision-artificial' },
];
