'use client';

import { useTranslations, useLocale } from 'next-intl';
import styles from '../kineticSwiss.module.css';

interface ContactStateProps {
  active: boolean;
  /** Lines revealed so far by the content stream engine. */
  streamedLines?: string[];
}

/**
 * Returns the content lines for this state (used by the orchestrator).
 * Line 0 = title, 1 = subtitle, 2 = CTA row.
 */
export function getContactLines(title: string, subtitle: string, cta1: string, cta2: string): string[] {
  return [title, subtitle, `${cta1} | ${cta2}`];
}

/** WhatsApp CTA link (ES primary, EN fallback). */
const WHATSAPP_HREF = 'https://wa.me/56930367979';
/** Calendly CTA link (EN primary). */
const CALENDLY_HREF = 'https://calendly.com/amoyano17/30min';

/**
 * Contact state: centered h2 + subtitle + CTA buttons.
 * Rendering gated by streamedLines from content stream engine.
 * All strings from KineticSwiss.states.contact i18n namespace.
 *
 * CTA routing is locale-dependent:
 *   ES: WhatsApp (primary) + /contacto form (secondary)
 *   EN: Calendly (primary) + /contact form (secondary)
 */
export function ContactState({ active, streamedLines }: ContactStateProps) {
  const t = useTranslations('KineticSwiss.states.contact');
  const locale = useLocale();
  const titleText = t('title.text');
  const subtitle = t('subtitle');
  const ctaPrimary = t('ctaPrimary');
  const ctaSecondary = t('ctaSecondary');

  const isES = locale === 'es';
  const primaryHref = isES ? WHATSAPP_HREF : CALENDLY_HREF;
  const secondaryHref = isES ? '/es/contacto' : '/en/contact';

  const stateClass = `${styles.state} ${styles.stateContact}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const isRevealed = (index: number) =>
    streamedLines != null && streamedLines.length > index;

  const lineClass = (index: number) =>
    `${styles.line}${isRevealed(index) ? ` ${styles.lineIn}` : ''}`;

  return (
    <div className={stateClass}>
      <div className={styles.contactInner}>
        <h2 className={`${styles.contactTitle} ${lineClass(0)}`}>
          {titleText}
        </h2>
        <p className={`${styles.contactSubtext} ${lineClass(1)}`}>
          {subtitle}
        </p>
        <div className={`${styles.ctaRow} ${lineClass(2)}`}>
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            {ctaPrimary}
          </a>
          <a href={secondaryHref} className={`${styles.cta} ${styles.ctaSecondary}`}>
            {ctaSecondary}
          </a>
        </div>
      </div>
    </div>
  );
}
