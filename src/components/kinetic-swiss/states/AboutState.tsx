'use client';

import { useTranslations } from 'next-intl';
import styles from '../kineticSwiss.module.css';

interface AboutStateProps {
  active: boolean;
}

export function AboutState({ active }: AboutStateProps) {
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

  const lineClass = (active: boolean) =>
    `${styles.line}${active ? ` ${styles.lineIn}` : ''}`;

  return (
    <div className={stateClass}>
      <div
        className={`${styles.aboutHeader} ${lineClass(active)}`}
        style={{ transitionDelay: active ? '100ms' : '0ms' }}
      >
        {header}
      </div>

      <h2
        className={`${styles.aboutTitle} ${lineClass(active)}`}
        style={{ transitionDelay: active ? '190ms' : '0ms' }}
      >
        {titleText}
      </h2>

      <p
        className={`${styles.aboutBody} ${lineClass(active)}`}
        style={{ transitionDelay: active ? '280ms' : '0ms' }}
      >
        {bioParagraph1}
      </p>

      {bioParagraph2 && (
        <p
          className={`${styles.aboutBody} ${lineClass(active)}`}
          style={{ transitionDelay: active ? '370ms' : '0ms' }}
        >
          {bioParagraph2}
        </p>
      )}

      <p
        className={`${styles.aboutItalic} ${lineClass(active)}`}
        style={{ transitionDelay: active ? `${bioParagraph2 ? 460 : 370}ms` : '0ms' }}
      >
        {italicQuote}
      </p>
    </div>
  );
}
