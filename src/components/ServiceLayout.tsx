'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { trackEvent, Events } from '@/lib/analytics/track';

/**
 * ServiceLayout — shared layout for the 7 service detail pages.
 *
 * Why it exists
 * -------------
 * Before this refactor, each of the 9 service pages was a ~230 LOC near-copy
 * of the same "beneficios / tecnologias / queOfrecemos / pasos" skeleton. The
 * content was generic (mentioning tools we don't even use — Dialogflow, UiPath,
 * Rasa, BERT) and had no anchoring to real projects. The Conversion Redesign
 * sprint replaces all that with a much shorter, honest layout:
 *
 *   1. Hero with badge + title + short description
 *   2. Long-form overview (3-5 sentences, anchored to reality)
 *   3. Real stack we actually use (max 6-8 pills, no inflation)
 *   4. Anchor project: 1 concrete production reference with metric
 *   5. Footer CTA (WhatsApp on ES, Calendly on EN once integrated)
 *
 * Each service page becomes ~50 LOC that just passes content to this layout.
 *
 * Tracking
 * --------
 * Fires `PAGE_VIEW_SERVICE` on mount with `{ service: serviceKey }` so we can
 * measure SEO long-tail arrival per service — the missing funnel signal
 * flagged in the diagnostic report.
 */

export type ServiceContent = {
  /** Stable slug used for tracking + i18n namespace. */
  serviceKey: string;
  /** Primary CTA destination (usually /contacto). */
  ctaHref: string;
  /** WhatsApp link for the ES CTA. */
  whatsappHref: string;
};

type Props = {
  service: ServiceContent;
};

export default function ServiceLayout({ service }: Props) {
  // The page passes `serviceKey` (e.g. "aiAssistants") and we read content
  // both from `Services.<serviceKey>` (hero + meta) and
  // `HomePage.services.items.<serviceKey>` (long description + stack +
  // anchor), so we never duplicate the content across two i18n trees.
  const servicesT = useTranslations(`Services.${service.serviceKey}`);
  const homeServicesT = useTranslations(
    `HomePage.services.items.${service.serviceKey}`
  );
  const layoutT = useTranslations('ServiceLayout');
  const footerT = useTranslations('Footer');

  useEffect(() => {
    trackEvent(Events.PAGE_VIEW_SERVICE, { service: service.serviceKey });
  }, [service.serviceKey]);

  // Raw array of stack items from the i18n tree. Next-intl returns an array
  // for keys that point to a JSON array via `t.raw`.
  const stack = homeServicesT.raw('stack') as string[];

  return (
    <div
      className="min-h-screen neu-bg"
      style={{ backgroundColor: 'var(--neu-bg)' }}
    >
      {/* Aurora Blobs */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>

      {/* HERO */}
      <section className="w-full py-20 sm:py-24 px-4 neu-bg relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link
            href="/inicio"
            className="neu-pressed inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-8"
            style={{ color: '#718096' }}
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            {layoutT('backButton')}
          </Link>

          <span
            className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-6"
            style={{ color: 'var(--neu-primary)' }}
          >
            {servicesT('hero.badge')}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            {servicesT('hero.title')}
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: '#718096', lineHeight: '1.7' }}
          >
            {servicesT('hero.description')}
          </p>
        </div>
      </section>

      {/* OVERVIEW — the long description from HomePage.services.items */}
      <section className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold neu-gradient-text">
            {layoutT('overviewTitle')}
          </h2>
        </div>

        <div className="neu-raised p-6 sm:p-8 rounded-2xl">
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: '#4a5568' }}
          >
            {homeServicesT('longDescription')}
          </p>
        </div>
      </section>

      {/* STACK — real pills only */}
      <section className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold neu-gradient-text">
            {layoutT('stackTitle')}
          </h2>
        </div>

        <div className="neu-pressed p-6 sm:p-8 rounded-2xl">
          <ul className="flex flex-wrap gap-3 justify-center">
            {stack.map((tech) => (
              <li
                key={tech}
                className="neu-raised px-4 py-2 rounded-full text-sm font-semibold"
                style={{ color: '#4a5568' }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ANCHOR PROJECT — 1 concrete production reference */}
      <section className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold neu-gradient-text">
            {layoutT('anchorTitle')}
          </h2>
        </div>

        <div className="neu-raised p-6 sm:p-8 rounded-2xl">
          <div className="flex items-start gap-4">
            <FiCheckCircle
              className="h-6 w-6 flex-shrink-0 mt-1"
              style={{ color: 'var(--neu-primary)' }}
              aria-hidden="true"
            />
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: '#4a5568' }}
            >
              {homeServicesT('anchorProject')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 neu-gradient-text">
            {layoutT('ctaTitle')}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={service.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-raised rounded-2xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
              style={{
                background: 'linear-gradient(145deg, #25D366, #128C7E)',
              }}
              onClick={() =>
                trackEvent(Events.CTA_WHATSAPP_CLICK, {
                  location: `service:${service.serviceKey}`,
                })
              }
            >
              <BsWhatsapp className="h-6 w-6 text-white" />
              <span className="text-base font-bold text-white">
                {layoutT('ctaButton')}
              </span>
            </a>

            <Link
              href="/contacto"
              className="neu-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              onClick={() =>
                trackEvent(Events.CTA_FULL_FORM_CLICK, {
                  location: `service:${service.serviceKey}`,
                })
              }
            >
              {layoutT('ctaSecondary')}
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer footer — honest attribution */}
      <footer
        className="py-8 px-4 neu-bg text-center"
        style={{ color: '#a0aec0' }}
      >
        <p className="max-w-3xl mx-auto text-xs leading-relaxed mb-2">
          {footerT('disclaimer')}
        </p>
        <p className="text-sm" style={{ color: '#718096' }}>
          &copy; 2026 {footerT('copyright')}
        </p>
      </footer>
    </div>
  );
}
