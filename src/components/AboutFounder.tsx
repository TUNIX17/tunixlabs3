'use client';

import { useTranslations } from 'next-intl';
import { FiExternalLink } from 'react-icons/fi';
import MITCredentialBadge from './MITCredentialBadge';

/**
 * AboutFounder — "Sobre el founder / About the founder" section for the home
 * page. Renders between CaseStudies (social proof) and the services grid
 * (category interest).
 *
 * Why this slot
 * -------------
 * The visitor just saw three concrete case studies with real metrics. The
 * natural next question is "OK but who is behind this?". The founder section
 * answers it with a photo + short bio that includes the MIT Professional
 * Education credential (via MITCredentialBadge which opens a modal with the
 * actual diploma). This is the highest-trust placement for the credential
 * — right after social proof, before the visitor goes down the services
 * rabbit hole.
 *
 * Layout
 * ------
 * - Mobile: photo stacked above bio.
 * - Desktop: photo left, bio right.
 * - Photo is the transparent PNG at `/team/alejandro-moyano.png` (already
 *   cropped, RGBA, 1197x1600). next/image renders it with explicit
 *   dimensions to avoid CLS.
 */

import Image from 'next/image';

export default function AboutFounder() {
  const t = useTranslations('HomePage.about');

  // The bio paragraph 1 contains a {mitBadge} placeholder that we replace with
  // the interactive MITCredentialBadge component. next-intl's rich text API
  // lets us pass a React-returning callback for the placeholder.
  //
  // We intentionally split the copy across two paragraphs (bioParagraph1 +
  // bioParagraph2) so the MIT claim sits tightly with the "training" context
  // and never lands on its own at the bottom of a long paragraph.

  return (
    <section
      aria-labelledby="about-founder-title"
      className="py-16 sm:py-20 neu-bg"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span
            className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase"
            style={{ color: 'var(--neu-primary)' }}
          >
            {t('badge')}
          </span>
          <h2
            id="about-founder-title"
            className="mt-4 text-3xl font-extrabold sm:text-4xl neu-gradient-text"
          >
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Photo column — 2/5 width on desktop, full width on mobile */}
          <div className="md:col-span-2 flex justify-center">
            <div className="relative neu-raised rounded-3xl p-3 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
              <Image
                src="/team/alejandro-moyano.png"
                alt={t('name')}
                width={360}
                height={480}
                priority={false}
                className="about-founder__photo w-full h-auto max-w-[320px] rounded-2xl"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Bio column — 3/5 width on desktop */}
          <div className="md:col-span-3">
            <p
              className="text-xl font-bold mb-1"
              style={{ color: '#2d3748' }}
            >
              {t('name')}
            </p>
            <p
              className="text-sm mb-5 font-medium"
              style={{ color: 'var(--neu-primary)' }}
            >
              {t('roleLine')}
            </p>

            <p
              className="text-base sm:text-lg leading-relaxed mb-4"
              style={{ color: '#4a5568' }}
            >
              {t.rich('bioParagraph1', {
                mit: (chunks) => (
                  <MITCredentialBadge>{chunks}</MITCredentialBadge>
                ),
              })}
            </p>

            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: '#4a5568' }}
            >
              {t('bioParagraph2')}
            </p>

            {/*
              LinkedIn outbound link — appears at the bottom of the bio as a
              "verify this claim" signal. Target=_blank so visitors don't lose
              the Tunixlabsweb tab, noopener+noreferrer for security.
            */}
            <a
              href={t('linkedinUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition-colors duration-200 hover:underline"
              style={{ color: 'var(--neu-primary)' }}
            >
              {t('linkedinLabel')}
              <FiExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
