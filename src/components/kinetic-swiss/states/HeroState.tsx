'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useCursorParallax } from '../hooks/useCursorParallax';
import { useUptime } from '../hooks/useUptime';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SplitFlapCounter, parseMetricValue } from '../SplitFlapCounter';
import styles from '../kineticSwiss.module.css';

interface MetaCell {
  label: string;
  value: string;
}

interface Headline {
  lines: string[];
  accentLine: number;
  outlineLine: number;
}

interface HeroStateProps {
  active: boolean;
  /** ISO date for uptime calculation */
  uptimeStart?: string;
}

export function HeroState({
  active,
  uptimeStart = '2024-02-01T00:00:00Z',
}: HeroStateProps) {
  const t = useTranslations('KineticSwiss.states.hero');
  const headline = t.raw('headline') as Headline;
  const metaGrid = t.raw('metaGrid') as MetaCell[];

  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const uptime = useUptime(uptimeStart);

  useCursorParallax(headingRef, active && !reducedMotion);

  const stateClass = `${styles.state} ${styles.stateHero}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const lines = headline.lines;
  const accentLines = [headline.accentLine];
  const outlineLines = [headline.outlineLine];

  // Replace "__UPTIME__" placeholder in meta values with live uptime
  const resolvedMeta = metaGrid.map((cell) => ({
    ...cell,
    value: cell.value === '__UPTIME__' && uptime ? uptime : cell.value,
  }));

  return (
    <div className={stateClass}>
      <h1 className={styles.monster} ref={headingRef}>
        {lines.map((line, i) => {
          const lineClass = `${styles.heroLine} ${styles.line}${
            active ? ` ${styles.heroLineRise} ${styles.lineIn}` : ''
          }`;

          const isAccent = accentLines.includes(i);
          const isOutline = outlineLines.includes(i);

          return (
            <span
              key={i}
              className={lineClass}
              style={{ transitionDelay: active ? `${i * 90 + 100}ms` : '0ms' }}
            >
              <span
                className={`${styles.heroLineInner}${
                  isAccent ? ` ${styles.accent}` : ''
                }${isOutline ? ` ${styles.outline}` : ''}`}
              >
                {line}
              </span>
            </span>
          );
        })}
      </h1>

      <div className={styles.heroMeta}>
        {resolvedMeta.map((cell, i) => {
          const cellClass = `${styles.metaCell} ${styles.line}${
            active ? ` ${styles.lineIn}` : ''
          }`;

          const isNumeric = /^\d/.test(cell.value.replace(/[,$]/g, ''));

          return (
            <div
              key={i}
              className={cellClass}
              style={{ transitionDelay: active ? `${(lines.length + i) * 90 + 100}ms` : '0ms' }}
            >
              <div className={styles.metaLabel}>{cell.label}</div>
              <div className={styles.metaValue}>
                {isNumeric ? (
                  <HeroMetricCounter value={cell.value} active={active} />
                ) : (
                  cell.value
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Renders a numeric hero meta value with split-flap count-up animation. */
function HeroMetricCounter({ value, active }: { value: string; active: boolean }) {
  const parsed = parseMetricValue(value);

  return (
    <SplitFlapCounter
      target={parsed.target}
      active={active}
      prefix={parsed.prefix}
      suffix={parsed.suffix}
    />
  );
}
