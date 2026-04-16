// RSC v3 — Awwwards preview path.
// Sprint-2: extracted legacy 1014 LOC into V3Client (dynamic ssr:false) so
//   /es/v3 + /en/v3 build cleanly under Next.js App Router.
// Sprint-3: prepends a server-rendered hero split (HeroSection + Rive
//   Production Monitor) so view-source emits the h1 + CTAs and the LCP
//   candidate is the SSR'd headline (not a deferred client mount).
//   V3Client still mounts below for the rest of the legacy sections;
//   sprint-4 will trim its duplicate hero terminal.
//
// See also: src/components/v3/V3Client.tsx (legacy client surface).

import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HeroSection, { type HeroSectionCopy } from '@/components/v3/HeroSection';

const HeroClientIsland = dynamic(
  () => import('@/components/v3/HeroClientIsland'),
  { ssr: false },
);
const V3Client = dynamic(() => import('@/components/v3/V3Client'), {
  ssr: false,
});

export default async function V3Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');

  const copy: HeroSectionCopy = {
    headline: `${t('hero.title1')} ${t('hero.title2')}`.trim(),
    accent: t('hero.title3'),
    sub: t('hero.description'),
    ctaPrimary: t('hero.cta.contact'),
    ctaSecondary: t('hero.cta.services'),
  };

  return (
    <>
      <section
        className="relative bg-ink text-paper pt-32 md:pt-40 pb-20 min-h-screen flex items-center"
        data-section="hero-split"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="grid items-center gap-10 md:gap-12 md:grid-cols-2">
            <HeroSection copy={copy} />
            <div className="w-full">
              <HeroClientIsland />
            </div>
          </div>
        </div>
      </section>
      <V3Client />
    </>
  );
}
