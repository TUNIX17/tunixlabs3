'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useCursorParallax } from '../hooks/useCursorParallax';
import { useUptime } from '../hooks/useUptime';
import { useReducedMotion } from '../hooks/useReducedMotion';
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
  /** Lines revealed so far by the content stream engine. */
  streamedLines?: string[];
}

/**
 * Returns the content lines for this state (used by the orchestrator).
 * Lines 0..N-1 = headline lines, N..N+M-1 = meta cells.
 */
export function getHeroLines(headline: Headline, metaGrid: MetaCell[]): string[] {
  return [
    ...headline.lines,
    ...metaGrid.map((cell) => `${cell.label}: ${cell.value}`),
  ];
}

/**
 * Hero state: giant typographic h1 with 4 lines + meta grid.
 * Lines animate in driven by streamedLines from the content stream engine.
 * Cursor parallax follows mouse. Uptime is computed live from uptimeStart prop.
 * All strings from KineticSwiss.states.hero i18n namespace.
 */
export function HeroState({
  active,
  uptimeStart = '2024-02-01T00:00:00Z',
  streamedLines,
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
          // A headline line is revealed when streamedLines[i] exists
          const revealed = streamedLines != null && streamedLines.length > i;

          const lineClass = `${styles.heroLine} ${styles.line}${
            revealed ? ` ${styles.heroLineRise}` : ''
          }`;

          const isAccent = accentLines.includes(i);
          const isOutline = outlineLines.includes(i);

          return (
            <span key={i} className={lineClass}>
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
          // Meta cells start after headline lines in streamedLines
          const metaRevealed = streamedLines != null && streamedLines.length > lines.length + i;

          const cellClass = `${styles.metaCell} ${styles.line}${
            metaRevealed ? ` ${styles.lineIn}` : ''
          }`;

          return (
            <div key={i} className={cellClass}>
              <div className={styles.metaLabel}>{cell.label}</div>
              <div className={styles.metaValue}>{cell.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
