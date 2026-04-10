'use client';

import { useTranslations } from 'next-intl';

/**
 * TrustedBy — social proof row rendered between the hero and the services grid
 * on the home page. Displays three direct-partner logos in full color, each in
 * a uniform container with fixed height so different formats (SVG/PNG/JPEG) and
 * backgrounds (transparent vs solid) align visually without making any logo
 * disappear.
 *
 * Why full color (no grayscale)
 * -----------------------------
 * The previous version applied `grayscale` + `opacity-60` by default as a
 * "trusted by" convention. In practice three assets with different background
 * types behaved very differently: ST Ltda became near-invisible, Schwager JPEG
 * read as a dark bounded box, Mindco faded into the neu-bg. The fix is to drop
 * the grayscale filter, normalize height to 48px with explicit container
 * padding so solid-background JPEGs breathe, and lean on a subtle opacity 0.8
 * as the only "muted" treatment. Hover restores full opacity with a 1.03 scale.
 *
 * Attribution rule (enforced): only DIRECT commissioning partners are shown
 * here. End clients whose relationship with TunixLabs is structural (i.e.
 * through a contractor that does the engagement) are NOT named on the landing
 * — see `HomePage.caseStudies` for indirect framing.
 */

type ClientLogo = {
  /** Stable key — used for React and `alt` fallback. */
  key: string;
  /** Human-readable client name, used as `alt` text. */
  name: string;
  /** Absolute path under `/public`. */
  src: string;
  /**
   * When the source asset has a solid (non-transparent) background, we add
   * extra horizontal padding inside the container so the logo doesn't look
   * cramped against the neu-pressed card. JPEGs default to true; transparent
   * PNG/SVG stay false.
   */
  hasSolidBackground?: boolean;
};

const logos: ClientLogo[] = [
  { key: 'stltda', name: 'ST Ltda.', src: '/logos/stltda.png' },
  {
    key: 'schwager',
    name: 'Schwager Energy',
    src: '/logos/schwager.jpeg',
    hasSolidBackground: true,
  },
  { key: 'mindco', name: 'Mindco', src: '/logos/mindco.png' },
];

export default function TrustedBy() {
  const t = useTranslations('HomePage.trustedBy');

  return (
    <section
      aria-labelledby="trusted-by-title"
      className="py-12 neu-bg relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="trusted-by-title"
          className="text-center text-sm font-semibold tracking-wide uppercase mb-8"
          style={{ color: '#718096' }}
        >
          {t('title')}
        </h2>

        <div className="neu-pressed rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
          <ul
            className="grid grid-cols-1 gap-6 items-center justify-items-center sm:grid-cols-3"
          >
            {logos.map((logo) => (
              <li
                key={logo.key}
                className="trusted-logo flex items-center justify-center w-full"
              >
                {/*
                  Fixed-height container (72px) with padding forces every logo
                  into the same visual footprint regardless of source aspect
                  ratio or background. object-contain keeps proportions.
                  Solid-background assets (JPEG) get extra horizontal padding
                  so the colored background doesn't touch the container edge.
                */}
                <div
                  className={[
                    'flex items-center justify-center h-[72px] w-full max-w-[220px]',
                    logo.hasSolidBackground ? 'px-3 py-1' : 'px-2',
                  ].join(' ')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className="trusted-logo__img h-12 w-auto max-w-full object-contain transition-all duration-300"
                    style={{ opacity: 0.8 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
