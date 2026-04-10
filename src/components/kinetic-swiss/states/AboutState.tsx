'use client';

import { useTranslations } from 'next-intl';
import styles from '../kineticSwiss.module.css';

export function AboutState({ active }: { active: boolean }) {
  const t = useTranslations('KineticSwiss.states.about');
  const lc = `${styles.line}${active ? ` ${styles.lineIn}` : ''}`;

  return (
    <div className={`${styles.state} ${styles.stateAbout}${active ? ` ${styles.stateActive}` : ''}`}>
      <div className={`${styles.aboutHeader} ${lc}`} style={{ transitionDelay: active ? '100ms' : '0ms' }}>
        {t('header')}
      </div>
      <h2 className={`${styles.aboutTitle} ${lc}`} style={{ transitionDelay: active ? '190ms' : '0ms' }}>
        {t('title.text')}
      </h2>
      <p className={`${styles.aboutBody} ${lc}`} style={{ transitionDelay: active ? '280ms' : '0ms' }}>
        {t.rich('bioParagraph1', { mit: (chunks) => <strong>{chunks}</strong> })}
      </p>
      {t('bioParagraph2') && (
        <p className={`${styles.aboutBody} ${lc}`} style={{ transitionDelay: active ? '370ms' : '0ms' }}>
          {t('bioParagraph2')}
        </p>
      )}
      <p className={`${styles.aboutItalic} ${lc}`} style={{ transitionDelay: active ? '460ms' : '0ms' }}>
        {t('italicQuote')}
      </p>
    </div>
  );
}
