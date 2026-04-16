// SERVER component — pure RSC, no 'use client' directive.
// Emits stable HTML so view-source shows the h1 + CTAs at request time.
// Client interactivity is added by sibling islands (dynamic ssr:false).
//
// Sprint-3 refactor: HeroSection is now content-only (no <section>, no
// own background, no min-h-screen). Callers (/inicio, /v3) own the wrapping
// section + grid so HeroSection can sit beside HeroClientIsland (Rive monitor).

import { Link } from '@/i18n/navigation';

export interface HeroSectionCopy {
  headline: string;
  accent?: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badge?: string;
}

export default function HeroSection({ copy }: { copy: HeroSectionCopy }) {
  return (
    <div data-section="hero-rsc" className="w-full">
      {copy.badge ? (
        <p
          className="font-mono text-xs tracking-[0.2em] uppercase text-acid mb-6"
          aria-label="section-badge"
        >
          {copy.badge}
        </p>
      ) : null}

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
        <span className="block">{copy.headline}</span>
        {copy.accent ? (
          <span className="block text-acid">{copy.accent}</span>
        ) : null}
      </h1>

      <p className="mt-6 max-w-2xl text-base md:text-lg text-paper/70 leading-relaxed">
        {copy.sub}
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 rounded-md bg-acid px-7 py-3 text-sm font-bold text-ink hover:opacity-90 transition"
        >
          {copy.ctaPrimary}
        </Link>
        <a
          href="#contacto"
          className="inline-flex items-center gap-2 rounded-md border border-paper/20 px-7 py-3 text-sm font-medium text-paper hover:border-paper/40 transition"
        >
          {copy.ctaSecondary}
        </a>
      </div>

      <p className="mt-10 font-mono text-[11px] tracking-[0.15em] uppercase text-paper/40">
        tunixlabs · production systems
      </p>
    </div>
  );
}
