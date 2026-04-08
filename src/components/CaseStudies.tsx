'use client';

import { useTranslations } from 'next-intl';
import { trackEvent, Events } from '@/lib/analytics/track';

/**
 * CaseStudies — "Casos en produccion" section rendered on the home page.
 *
 * All card content is read from i18n (`HomePage.caseStudies.cards.<key>`)
 * so copy can vary between ES and EN without literal translation. This is
 * the fix for the P0 attribution violation detected in diagnostic-sprint-1:
 * the previous version hardcoded "SIME · Codelco" in the client field
 * (line 33 of the prior implementation), which breaks the attribution rule
 * declared in sprint-plan.md and `~/.claude/agents/tunix-cro.md` — Codelco
 * cannot be named directly because Codelco does not know TunixLabs exists.
 *
 * Indirect attribution lives in the i18n data now:
 * - sime             → "Contratistas en operaciones mineras criticas (Chile)"
 * - schwager         → "Schwager Energy (via partner tecnico)"
 * - gasDistribution  → "Distribuidora regional de gas en Chile"  (was RapiGas)
 * - apoderapp        → "Apoderapp (producto propio)"
 *
 * The disclaimer footer makes the indirect-client relationship explicit so
 * readers understand the partnership structure without surprise.
 */

// Order defines the visual grid order left-to-right, top-to-bottom.
// Keep the 4 most credible first — sime and schwager carry the industrial
// weight, gasDistribution shows commercial traction, apoderapp is the
// own-product proof-of-full-stack.
const cardKeys = ['sime', 'schwager', 'gasDistribution', 'apoderapp'] as const;

export default function CaseStudies() {
  const t = useTranslations('HomePage.caseStudies');

  return (
    <section aria-labelledby="case-studies-title" className="py-16 neu-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span
            className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase"
            style={{ color: 'var(--neu-primary)' }}
          >
            {t('badge')}
          </span>
          <h2
            id="case-studies-title"
            className="mt-4 text-3xl font-extrabold sm:text-4xl neu-gradient-text"
          >
            {t('title')}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl" style={{ color: '#718096' }}>
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cardKeys.map((key) => {
            // `t.raw` returns the parsed JSON value, used for the string[] stack field.
            const stack = t.raw(`cards.${key}.stack`) as string[];
            return (
              <article
                key={key}
                onClick={() =>
                  trackEvent(Events.CASE_STUDY_CLICK, { case: key })
                }
                className="neu-raised rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <h3 className="text-lg font-bold mb-4 neu-gradient-text leading-snug">
                  {t(`cards.${key}.client`)}
                </h3>

                <p className="text-sm mb-2" style={{ color: '#718096' }}>
                  <strong
                    className="font-semibold"
                    style={{ color: '#4a5568' }}
                  >
                    {t(`cards.${key}.problem`)}
                  </strong>
                </p>
                <p className="text-sm mb-5" style={{ color: '#718096' }}>
                  {t(`cards.${key}.solution`)}
                </p>

                <div className="neu-pressed rounded-xl px-4 py-3 mb-5 mt-auto">
                  <p className="text-sm font-bold leading-snug neu-gradient-text">
                    {t(`cards.${key}.metric`)}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: '#a0aec0' }}
                  >
                    {t('stack')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stack.map((tech) => (
                      <span
                        key={tech}
                        className="neu-pressed text-xs px-2 py-1 rounded-md"
                        style={{ color: '#4a5568' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Honest attribution disclaimer */}
        <p
          className="mt-10 max-w-4xl mx-auto text-center text-xs leading-relaxed px-4"
          style={{ color: '#a0aec0' }}
        >
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
