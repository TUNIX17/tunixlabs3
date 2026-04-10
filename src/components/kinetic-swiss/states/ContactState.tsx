'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TIMING } from '../timing';
import styles from '../kineticSwiss.module.css';

interface CTA {
  label: string;
  href: string;
}

interface ContactStateProps {
  active: boolean;
  title: string;
  subtitle: string;
  ctas: CTA[];
}

/**
 * Contact state: centered h2 + subtitle + CTA buttons.
 * First CTA is primary (dark bg), subsequent ones are secondary (outline).
 */
export function ContactState({
  active,
  title,
  subtitle,
  ctas,
}: ContactStateProps) {
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!active) {
      setRevealed(false);
      return;
    }

    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, [active, reducedMotion]);

  const stateClass = `${styles.state} ${styles.stateContact}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const lineClass = revealed ? `${styles.line} ${styles.lineIn}` : styles.line;

  const lineStyle = (index: number): React.CSSProperties | undefined =>
    !reducedMotion
      ? { transitionDelay: `${index * TIMING.LINE_STAGGER_MS}ms` }
      : undefined;

  return (
    <div className={stateClass}>
      <div className={styles.contactInner}>
        <h2 className={`${styles.contactTitle} ${lineClass}`} style={lineStyle(0)}>
          {title}
        </h2>
        <p className={`${styles.contactSubtext} ${lineClass}`} style={lineStyle(1)}>
          {subtitle}
        </p>
        <div className={`${styles.ctaRow} ${lineClass}`} style={lineStyle(2)}>
          {ctas.map((cta, i) => (
            <a
              key={i}
              href={cta.href}
              className={`${styles.cta}${i > 0 ? ` ${styles.ctaSecondary}` : ''}`}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
