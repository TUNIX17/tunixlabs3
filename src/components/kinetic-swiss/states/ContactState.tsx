'use client';

import { useTranslations, useLocale } from 'next-intl';
import { RiveWithFallback } from '../rive/RiveWithFallback';
import styles from '../kineticSwiss.module.css';

interface ContactStateProps {
  active: boolean;
}

/** WhatsApp CTA link (ES primary, EN fallback). */
const WHATSAPP_HREF = 'https://wa.me/56930367979';
/** Calendly CTA link (EN primary). */
const CALENDLY_HREF = 'https://calendly.com/amoyano17/30min';

export function ContactState({ active }: ContactStateProps) {
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

  const lineClass = `${styles.line}${active ? ` ${styles.lineIn}` : ''}`;

  return (
    <div className={stateClass}>
      <div className={styles.contactInner}>
        <h2
          className={`${styles.contactTitle} ${lineClass}`}
          style={{ transitionDelay: active ? '100ms' : '0ms' }}
        >
          {titleText}
        </h2>
        <p
          className={`${styles.contactSubtext} ${lineClass}`}
          style={{ transitionDelay: active ? '190ms' : '0ms' }}
        >
          {subtitle}
        </p>
        {/* Voice AI waveform — Rive micro-animation */}
        <div
          className={lineClass}
          style={{ transitionDelay: active ? '240ms' : '0ms', width: 200, height: 40, margin: '16px auto' }}
        >
          <RiveWithFallback
            src="/design-explorations/rive/voice-waveform.riv"
            className={styles.voiceWaveform}
            fallback={<div style={{ width: 200, height: 40, background: 'transparent' }} />}
          />
        </div>
        <div
          className={`${styles.ctaRow} ${lineClass}`}
          style={{ transitionDelay: active ? '280ms' : '0ms' }}
        >
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
