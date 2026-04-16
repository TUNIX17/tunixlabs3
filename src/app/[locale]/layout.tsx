import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Nav from '@/components/Nav';
import { ChatwootWidget } from '@/components/ChatwootWidget';
import { LenisProvider } from '@/components/kinetic-swiss/LenisProvider';
import JsonLd from '@/components/seo/JsonLd';
import {
  organizationSchema,
  personSchema,
  websiteSchema,
} from '@/components/seo/schemas';
import '../../styles/globals.css';
// Kinetic Swiss v3 design tokens (paper/ink/acid palette).
import '../../styles/kinetic-swiss-vars.css';
// Motion layer — reserved for scroll-reveal and transition overrides.
// Imported AFTER globals so the cascade gives it the last word.
import '../../styles/animations.css';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const keywordsByLocale: Record<string, string[]> = {
    es: [
      'desarrollo web chile',
      'agencia IA santiago',
      'voice AI latam',
      'SaaS B2B chile',
      'BI dashboards mineria',
      'integracion SAP',
      'AI readiness',
      'nearshore development',
    ],
    en: [
      'AI agency LATAM',
      'voice AI development',
      'nearshore software',
      'enterprise AI consulting',
      'SaaS B2B development',
      'BI dashboards mining',
      'machine learning agency',
      'react nextjs experts',
    ],
  };

  const keywords = keywordsByLocale[locale] ?? keywordsByLocale.es;
  const ogLocale = locale === 'en' ? 'en_US' : 'es_CL';

  return {
    metadataBase: new URL('https://tunixlabs.com'),
    title: t('title'),
    description: t('description'),
    keywords,
    alternates: {
      canonical: `/${locale}/inicio`,
      languages: {
        es: '/es/inicio',
        en: '/en/inicio',
        'x-default': '/es/inicio',
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      siteName: 'Tunix Labs',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/og/tunixlabs-og.png',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og/tunixlabs-og.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // next-intl: enable static rendering by telling next-intl which locale
  // the current segment is using. Must be called BEFORE any awaited
  // server-side translation / i18n call in this layout or its descendants.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/*
          hreflang is emitted by Next.js via generateMetadata.alternates.languages
          (see above). Do not duplicate it here.

          Plausible analytics. Only injected when NEXT_PUBLIC_PLAUSIBLE_DOMAIN
          is set (production) so local dev never hits plausible.io. The
          `tagged-events` build lets us track clicks on elements tagged with
          `plausible-event-name=...` classes without importing a JS SDK.
          Events are fired via `src/lib/analytics/track.ts`.
        */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.outbound-links.tagged-events.js"
          />
        )}
        {/*
          JSON-LD schemas — Organization, Person (CEO), WebSite with SearchAction.
          Emitted per locale layout so every page inherits the signals. JSON-LD
          is language-agnostic; we only have one canonical set (no localized
          duplicates) to avoid confusing crawlers.
        */}
        <JsonLd schema={organizationSchema} />
        <JsonLd schema={personSchema} />
        <JsonLd schema={websiteSchema} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Nav />
            <main className="min-h-screen">{children}</main>
            <ChatwootWidget />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
