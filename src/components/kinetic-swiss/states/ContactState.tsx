'use client';

import { useTranslations, useLocale } from 'next-intl';
import { RiveWithFallback } from '../rive/RiveWithFallback';
import styles from '../kineticSwiss.module.css';

const WHATSAPP_HREF = 'https://wa.me/56930367979';
const CALENDLY_HREF = 'https://calendly.com/amoyano17/30min';

export function ContactState({ active }: { active: boolean }) {
  const t = useTranslations('KineticSwiss.states.contact');
  const locale = useLocale();
  const isES = locale === 'es';
  const lc = `${styles.line}${active ? ` ${styles.lineIn}` : ''}`;

  return (
    <div className={`${styles.state} ${styles.stateContact}${active ? ` ${styles.stateActive}` : ''}`}>
      <div className={styles.contactInner}>
        <h2 className={`${styles.contactTitle} ${lc}`} style={{ transitionDelay: active ? '100ms' : '0ms' }}>
          {t('title.text')}
        </h2>
        <p className={`${styles.contactSubtext} ${lc}`} style={{ transitionDelay: active ? '190ms' : '0ms' }}>
          {t('subtitle')}
        </p>
        {/* Voice waveform Rive — evokes Voice AI dimension */}
        <div className={lc} style={{ transitionDelay: active ? '240ms' : '0ms', width: 200, height: 40, margin: '16px auto' }}>
          <RiveWithFallback
            src="/design-explorations/rive/voice-waveform.riv"
            fallback={<div style={{ width: 200, height: 40 }} />}
          />
        </div>
        <div className={`${styles.ctaRow} ${lc}`} style={{ transitionDelay: active ? '320ms' : '0ms' }}>
          <a href={isES ? WHATSAPP_HREF : CALENDLY_HREF} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            {t('ctaPrimary')}
          </a>
          <a href={isES ? '/es/contacto' : '/en/contact'} className={`${styles.cta} ${styles.ctaSecondary}`}>
            {t('ctaSecondary')}
          </a>
        </div>
      </div>
    </div>
  );
}
