'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useCursorParallax } from '../hooks/useCursorParallax';
import { useUptime } from '../hooks/useUptime';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SplitFlapCounter, parseMetricValue } from '../SplitFlapCounter';
import styles from '../kineticSwiss.module.css';

interface MetaCell { label: string; value: string }
interface Headline { lines: string[]; accentLine: number; outlineLine: number }

interface HeroStateProps {
  active: boolean;
  uptimeStart?: string;
}

export function HeroState({ active, uptimeStart = '2024-02-01T00:00:00Z' }: HeroStateProps) {
  const t = useTranslations('KineticSwiss.states.hero');
  const headline = t.raw('headline') as Headline;
  const metaGrid = t.raw('metaGrid') as MetaCell[];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const uptime = useUptime(uptimeStart);

  useCursorParallax(headingRef, active && !reducedMotion);

  const resolvedMeta = metaGrid.map((cell) => ({
    ...cell,
    value: cell.value === '__UPTIME__' && uptime ? uptime : cell.value,
  }));

  return (
    <div className={`${styles.state} ${styles.stateHero}${active ? ` ${styles.stateActive}` : ''}`}>
      <h1 className={styles.monster} ref={headingRef}>
        {headline.lines.map((line, i) => (
          <span
            key={i}
            className={`${styles.heroLine} ${styles.line}${active ? ` ${styles.heroLineRise} ${styles.lineIn}` : ''}`}
            style={{ transitionDelay: active ? `${i * 90 + 100}ms` : '0ms' }}
          >
            <span className={`${styles.heroLineInner}${
              [headline.accentLine].includes(i) ? ` ${styles.accent}` : ''
            }${[headline.outlineLine].includes(i) ? ` ${styles.outline}` : ''}`}>
              {line}
            </span>
          </span>
        ))}
      </h1>

      <div className={styles.heroMeta}>
        {resolvedMeta.map((cell, i) => (
          <div
            key={i}
            className={`${styles.metaCell} ${styles.line}${active ? ` ${styles.lineIn}` : ''}`}
            style={{ transitionDelay: active ? `${(headline.lines.length + i) * 90 + 100}ms` : '0ms' }}
          >
            <div className={styles.metaLabel}>{cell.label}</div>
            <div className={styles.metaValue}>
              {/^\d/.test(cell.value.replace(/[,$]/g, '')) ? (
                <SplitFlapCounter {...parseMetricValue(cell.value)} active={active} />
              ) : cell.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
