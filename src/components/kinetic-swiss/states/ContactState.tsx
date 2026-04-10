'use client';

import { useTranslations } from 'next-intl';
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

/**
 * Contact state: centered h2 + subtitle + CTA buttons.
 * Rendering gated by streamedLines from content stream engine.
 * All strings from KineticSwiss.states.contact i18n namespace.
 */
export function ContactState({ active, streamedLines }: ContactStateProps) {
  const t = useTranslations('KineticSwiss.states.contact');
  const titleText = t('title.text');
  const subtitle = t('subtitle');
  const ctaPrimary = t('ctaPrimary');
  const ctaSecondary = t('ctaSecondary');

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
          <a href="#" className={styles.cta}>
            {ctaPrimary}
          </a>
          <a href="#" className={`${styles.cta} ${styles.ctaSecondary}`}>
            {ctaSecondary}
          </a>
        </div>
      </div>
    </div>
  );
}
