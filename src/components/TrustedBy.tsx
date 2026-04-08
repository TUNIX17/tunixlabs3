'use client';

import { useTranslations } from 'next-intl';

/**
 * TrustedBy — social proof row rendered between the hero and the services grid
 * on the home page. Displays three direct-partner logos in a neutral grayscale
 * style with a subtle hover-to-color effect.
 *
 * Attribution rule (enforced): only DIRECT commissioning partners are shown
 * here. End clients whose relationship with TunixLabs is structural (i.e.
 * through a contractor that does the engagement) are NOT named on the landing
 * — see `HomePage.caseStudies` for indirect framing ("Contractors at Chile's
 * largest copper mining operations" etc.). Logos live in `public/logos/`;
 * they are officially-provided brand assets, not placeholders.
 */

type ClientLogo = {
  /** Stable key — used for React and `alt` fallback. */
  key: string;
  /** Human-readable client name, used as `alt` text. */
  name: string;
  /** Absolute path under `/public`. */
  src: string;
};

const logos: ClientLogo[] = [
  { key: 'stltda', name: 'ST Ltda.', src: '/logos/stltda.png' },
  { key: 'schwager', name: 'Schwager Energy', src: '/logos/schwager.jpeg' },
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
            className="grid grid-cols-1 gap-8 items-center justify-items-center sm:grid-cols-3"
          >
            {logos.map((logo) => (
              <li key={logo.key} className="flex items-center justify-center w-full">
                {/*
                  Using a plain <img> (not next/image) because the logos are
                  small static SVGs and next/image adds complexity without
                  benefit here. The grayscale->color hover is a pure CSS
                  treatment that works on any <img>.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  width={200}
                  height={80}
                  loading="lazy"
                  className="max-h-12 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
