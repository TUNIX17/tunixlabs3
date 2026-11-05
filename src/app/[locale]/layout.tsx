import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import JsonLd from '@/components/seo/JsonLd';
import {
  organizationSchema,
  personSchema,
  websiteSchema,
} from '@/components/seo/schemas';
import '../../styles/globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const ogLocale = locale === 'en' ? 'en_US' : 'es_CL';

  return {
    metadataBase: new URL('https://tunixlabs.com'),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: '/es',
        en: '/en',
        'x-default': '/es',
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      siteName: 'Alejandro Moyano',
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // next-intl: habilita el render estático para este segmento. Debe llamarse
  // ANTES de cualquier await de traducciones en el layout o sus hijos.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/*
          Plausible: solo se inyecta si NEXT_PUBLIC_PLAUSIBLE_DOMAIN está
          definida (producción), para que el desarrollo local no llame a
          plausible.io. Los eventos salen por src/lib/analytics/track.ts.
        */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.outbound-links.tagged-events.js"
          />
        )}
        <JsonLd schema={organizationSchema} />
        <JsonLd schema={personSchema} />
        <JsonLd schema={websiteSchema} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
