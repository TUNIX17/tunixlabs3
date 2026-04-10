'use client';

import { useRef, useState, useEffect } from 'react';
import { useCursorParallax } from '../hooks/useCursorParallax';
import { useUptime } from '../hooks/useUptime';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TIMING } from '../timing';
import styles from '../kineticSwiss.module.css';

interface MetaCell {
  label: string;
  value: string;
}

interface HeroStateProps {
  active: boolean;
  /** 4 lines for the h1.monster block */
  lines: string[];
  /** 4 meta cells at the bottom */
  metaGrid: MetaCell[];
  /** ISO date for uptime calculation — replaces "uptime" placeholder values */
  uptimeStart?: string;
  /** Which line indices get the .accent class */
  accentLines?: number[];
  /** Which line indices get the .outline class */
  outlineLines?: number[];
}

/**
 * Hero state: giant typographic h1 with 4 lines + meta grid.
 * Lines animate in with a stagger on mount. Cursor parallax follows mouse.
 * Uptime is computed live from uptimeStart prop.
 */
export function HeroState({
  active,
  lines,
  metaGrid,
  uptimeStart = '2011-01-01',
  accentLines = [3],
  outlineLines = [1],
}: HeroStateProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const [risen, setRisen] = useState(false);
  const uptime = useUptime(uptimeStart);

  useCursorParallax(headingRef, active && !reducedMotion);

  // Trigger rise animation after mount + entrance delay
  useEffect(() => {
    if (!active) {
      setRisen(false);
      return;
    }

    if (reducedMotion) {
      setRisen(true);
      return;
    }

    const timer = setTimeout(() => setRisen(true), TIMING.HERO_ENTRANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [active, reducedMotion]);

  const stateClass = `${styles.state} ${styles.stateHero}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  // Replace "uptime" placeholder in meta values
  const resolvedMeta = metaGrid.map((cell) => ({
    ...cell,
    value: cell.value === '__UPTIME__' && uptime ? uptime : cell.value,
  }));

  return (
    <div className={stateClass}>
      <h1 className={styles.monster} ref={headingRef}>
        {lines.map((line, i) => {
          const lineClass = `${styles.heroLine} ${styles.line}${
            risen ? ` ${styles.heroLineRise}` : ''
          }`;

          // Determine text treatment
          const isAccent = accentLines.includes(i);
          const isOutline = outlineLines.includes(i);

          const innerStyle: React.CSSProperties = !reducedMotion
            ? { transitionDelay: `${i * TIMING.HERO_LINE_STAGGER_MS}ms` }
            : {};

          return (
            <span key={i} className={lineClass}>
              <span
                className={`${styles.heroLineInner}${
                  isAccent ? ` ${styles.accent}` : ''
                }${isOutline ? ` ${styles.outline}` : ''}`}
                style={innerStyle}
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
            risen ? ` ${styles.lineIn}` : ''
          }`;
          const cellStyle: React.CSSProperties = !reducedMotion
            ? {
                transitionDelay: `${
                  (lines.length + i) * TIMING.LINE_STAGGER_MS +
                  TIMING.HERO_ENTRANCE_DELAY_MS
                }ms`,
              }
            : {};

          return (
            <div key={i} className={cellClass} style={cellStyle}>
              <div className={styles.metaLabel}>{cell.label}</div>
              <div className={styles.metaValue}>{cell.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
