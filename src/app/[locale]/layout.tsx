import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import JsonLd from '@/components/seo/JsonLd';
import {
  organizationSchema,
  personSchema,
  websiteSchema,
} from '@/components/seo/schemas';
import '../../styles/globals.css';
// Kinetic Swiss v3 design tokens (paper/ink/acid palette).
import '../../styles/kinetic-swiss-vars.css';
// Motion layer lives separate from globals so we can iterate on it without
// touching the rest of the neu design system. Imported AFTER globals so the
// cascade gives it the last word on animated properties.
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

  const messages = await getMessages();
  const t = await getTranslations('Layout');

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
          <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 pt-4 z-30 bg-transparent">
            <Link href="/inicio" className="flex items-center">
              <img
                src="/logo_tunixlabs_negro.png"
                alt="Logo TunixLabs"
                className="h-24 w-auto"
              />
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/inicio"
                className="text-lg font-semibold text-white hover:text-blue-300 transition-all duration-300"
              >
                {t('nav.home')}
              </Link>
              <LanguageSwitcher locale={locale} />
            </nav>
          </header>
          <main className="min-h-screen">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
