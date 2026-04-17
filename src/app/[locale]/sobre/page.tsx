import { setRequestLocale, getTranslations } from 'next-intl/server';
import AboutPage from '@/components/AboutPage';

type Locale = 'es' | 'en';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.about' });
  const isES = locale === 'es';

  return {
    title: isES
      ? 'Sobre el founder — Alejandro Moyano Foncea · Tunix Labs'
      : 'About the founder — Alejandro Moyano Foncea · Tunix Labs',
    description: isES
      ? 'CEO y operador de Tunix Labs. MSc Finanzas + MIT Professional Education. 15 años liderando operaciones antes de escribir código. Sistemas en producción, no demos.'
      : 'Tunix Labs CEO and solo operator. MSc Finance + MIT Professional Education. 15 years leading real ops before writing code. Production systems, not demos.',
    alternates: {
      canonical: `/${locale}/${isES ? 'sobre' : 'about'}`,
      languages: {
        es: '/es/sobre',
        en: '/en/about',
        'x-default': '/es/sobre',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('roleLine'),
      images: [{ url: '/team/alejandro-moyano.png', width: 1197, height: 1600 }],
    },
  };
}

export default async function SobrePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return <AboutPage locale={locale} />;
}
