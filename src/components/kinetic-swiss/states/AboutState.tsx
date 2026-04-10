'use client';

import { useTranslations } from 'next-intl';
import styles from '../kineticSwiss.module.css';

interface AboutStateProps {
  active: boolean;
  /** Lines revealed so far by the content stream engine. */
  streamedLines?: string[];
}

/**
 * Returns the content lines for this state (used by the orchestrator).
 * Line 0 = header, 1 = title, 2 = bio1, 3 = bio2 (if present), last = quote.
 */
export function getAboutLines(
  header: string,
  title: string,
  bio1: string,
  bio2: string | undefined,
  quote: string
): string[] {
  const result = [header, title, bio1];
  if (bio2) result.push(bio2);
  result.push(quote);
  return result;
}

/**
 * About state: header + title + bio paragraphs + italic quote.
 * This state triggers the aside terminal to appear (handled by the orchestrator).
 * Rendering gated by streamedLines from content stream engine.
 * All strings from KineticSwiss.states.about i18n namespace.
 */
export function AboutState({ active, streamedLines }: AboutStateProps) {
  const t = useTranslations('KineticSwiss.states.about');
  const header = t('header');
  const titleText = t('title.text');
  const bioParagraph1 = t.rich('bioParagraph1', {
    mit: (chunks) => <strong>{chunks}</strong>,
  });
  const bioParagraph2 = t('bioParagraph2');
  const italicQuote = t('italicQuote');

  const stateClass = `${styles.state} ${styles.stateAbout}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const isRevealed = (index: number) =>
    streamedLines != null && streamedLines.length > index;

  const lineClass = (index: number) =>
    `${styles.line}${isRevealed(index) ? ` ${styles.lineIn}` : ''}`;

  return (
    <div className={stateClass}>
      <div className={`${styles.aboutHeader} ${lineClass(0)}`}>
        {header}
      </div>

      <h2 className={`${styles.aboutTitle} ${lineClass(1)}`}>
        {titleText}
      </h2>

      <p className={`${styles.aboutBody} ${lineClass(2)}`}>
        {bioParagraph1}
      </p>

      {bioParagraph2 && (
        <p className={`${styles.aboutBody} ${lineClass(3)}`}>
          {bioParagraph2}
        </p>
      )}

      <p className={`${styles.aboutItalic} ${lineClass(bioParagraph2 ? 4 : 3)}`}>
        {italicQuote}
      </p>
    </div>
  );
}
