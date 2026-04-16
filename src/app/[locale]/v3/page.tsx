// RSC thin wrapper.
// v3/page.tsx used to be a 1014-LOC 'use client' page that referenced window/
// document at module load time. We now server-render it as an async RSC that
// calls setRequestLocale() and mounts the legacy client surface behind a
// dynamic ssr:false island. This unblocks /es/v3 + /en/v3 in production
// without rewriting the interactive terminal yet (Sprint 3 will extract).
//
// See also: src/components/v3/V3Client.tsx (legacy client bundle).

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
