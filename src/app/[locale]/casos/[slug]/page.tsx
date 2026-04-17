import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { CASES } from '@/lib/cases-data';
import CaseDetail from '@/components/cases/CaseDetail';

type Locale = 'es' | 'en';

type Props = {
  params: { locale: Locale; slug: string };
};

export function generateStaticParams() {
  const locales: Locale[] = ['es', 'en'];
  return locales.flatMap((locale) =>
    CASES.map((c) => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({ params: { locale, slug } }: Props) {
  const caseData = CASES.find((c) => c.slug === slug);
  if (!caseData) return {};

  const isES = locale === 'es';
  const title = isES ? caseData.titleEs : caseData.titleEn;
  const description = isES ? caseData.problemEs : caseData.problemEn;
  const path = isES ? `/casos/${slug}` : `/cases/${slug}`;

  return {
    title: `${title} — Tunix Labs`,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        es: `/es/casos/${slug}`,
        en: `/en/cases/${slug}`,
        'x-default': `/es/casos/${slug}`,
      },
    },
    openGraph: {
      title: `${title} — Tunix Labs`,
      description: description.slice(0, 160),
      images: caseData.images.slice(0, 1),
    },
  };
}

export default async function CaseDetailPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);

  const caseData = CASES.find((c) => c.slug === slug);
  if (!caseData) notFound();

  const currentIndex = CASES.findIndex((c) => c.slug === slug);
  const nextCase = CASES[(currentIndex + 1) % CASES.length];
  const prevCase = CASES[(currentIndex - 1 + CASES.length) % CASES.length];

  return (
    <CaseDetail
      caseData={caseData}
      nextCase={nextCase}
      prevCase={prevCase}
      locale={locale}
    />
  );
}
