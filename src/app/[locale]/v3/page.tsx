import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';

const V3Client = dynamic(() => import('@/components/v3/V3Client'), {
  ssr: false,
});

export default async function V3Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <V3Client />;
}
