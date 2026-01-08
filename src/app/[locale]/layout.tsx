import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '../../styles/globals.css';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://tunixlabs.com/${locale}`,
      languages: {
        es: 'https://tunixlabs.com/es',
        en: 'https://tunixlabs.com/en',
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
        <link rel="alternate" hrefLang="es" href="https://tunixlabs.com/es" />
        <link rel="alternate" hrefLang="en" href="https://tunixlabs.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://tunixlabs.com/es" />
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
