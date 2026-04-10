'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TIMING } from '../timing';
import styles from '../kineticSwiss.module.css';

interface ServiceItem {
  title: string;
  description: string;
  /** Grid span class index (1-6). Maps to .svc1 through .svc6 */
  span?: number;
}

interface ServicesStateProps {
  active: boolean;
  title?: string;
  countLabel?: string;
  items: ServiceItem[];
}

const SVC_CLASS_MAP: Record<number, string> = {
  1: styles.svc1,
  2: styles.svc2,
  3: styles.svc3,
  4: styles.svc4,
  5: styles.svc5,
  6: styles.svc6,
};

/**
 * Services state: header with count + asymmetric grid of service cards.
 * Each card has the invert-on-hover treatment (dark bg slides up).
 */
export function ServicesState({
  active,
  title = 'What I ship.',
  countLabel = 'Total areas',
  items,
}: ServicesStateProps) {
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

  const stateClass = `${styles.state} ${styles.stateServices}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const count = String(items.length).padStart(2, '0');

  return (
    <div className={stateClass}>
      {/* Header */}
      <div
        className={`${styles.servicesHead} ${styles.line}${
          revealed ? ` ${styles.lineIn}` : ''
        }`}
      >
        <h2 className={styles.servicesHeadTitle}>{title}</h2>
        <div className={styles.servicesCount}>
          {countLabel}
          <strong className={styles.servicesCountNumber}>{count}</strong>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.servicesGrid}>
        {items.map((item, i) => {
          const spanClass = SVC_CLASS_MAP[i + 1] ?? '';
          const lineStyle: React.CSSProperties = !reducedMotion
            ? { transitionDelay: `${(i + 1) * TIMING.LINE_STAGGER_MS}ms` }
            : {};

          return (
            <div
              key={i}
              className={`${styles.svc} ${spanClass} ${styles.line}${
                revealed ? ` ${styles.lineIn}` : ''
              }`}
              style={lineStyle}
            >
              <div className={styles.svcNum}>
                {String(i + 1).padStart(2, '0')} / {count}
              </div>
              <h3 className={styles.svcTitle}>{item.title}</h3>
              <div className={styles.svcMeta}>{item.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
