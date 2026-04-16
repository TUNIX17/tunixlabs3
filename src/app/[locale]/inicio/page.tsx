// RSC version of /inicio.
// Previously a 3-line 'use client' wrapper around <KineticSwissPage>, which
// produced a near-empty view-source. This version renders HeroSection as
// server HTML (h1, copy, CTAs visible in view-source), then mounts client
// islands with ssr:false for interactivity.
//
// Sprint 3 will fill the islands with Rive/scroll/terminal logic while
// keeping the RSC contract.

import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HeroSection, { type HeroSectionCopy } from '@/components/v3/HeroSection';

const HeroClientIsland = dynamic(
  () => import('@/components/v3/HeroClientIsland'),
  { ssr: false },
);
const TerminalClient = dynamic(
  () => import('@/components/v3/TerminalClient'),
  { ssr: false },
);
const ScrollDriverClient = dynamic(
  () => import('@/components/v3/ScrollDriverClient'),
  { ssr: false },
);

export default async function InicioPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');

  // Compose headline from existing title1 + title2; use title3 as accent,
  // since HomePage.hero has title1/title2/title3/description/cta.contact/cta.services
  // (see src/messages/{es,en}.json).
  const headline = `${t('hero.title1')} ${t('hero.title2')}`.trim();
  const accent = t('hero.title3');
  const sub = t('hero.description');
  const ctaPrimary = t('hero.cta.contact');
  const ctaSecondary = t('hero.cta.services');

  const copy: HeroSectionCopy = {
    headline,
    accent,
    sub,
    ctaPrimary,
    ctaSecondary,
  };

  return (
    <>
      <HeroSection copy={copy} />
      <HeroClientIsland />
      <TerminalClient />
      <ScrollDriverClient />
    </>
  );
}
