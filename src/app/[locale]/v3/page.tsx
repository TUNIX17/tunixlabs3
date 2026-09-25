import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import { localizedPath, toLocale } from '@/lib/seo/alternates';

const V3Client = dynamic(() => import('@/components/v3/V3Client'), {
  ssr: false,
});

// Same client as /inicio: keep this duplicate out of the index.
export function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: localizedPath(toLocale(locale), '/inicio') },
  };
}

export default async function V3Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <V3Client />;
}
