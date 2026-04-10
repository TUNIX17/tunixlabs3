'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TIMING } from '../timing';
import styles from '../kineticSwiss.module.css';

interface AboutStateProps {
  active: boolean;
  header: string;
  title: string;
  bioParagraph1: string;
  bioParagraph2?: string;
  italicQuote: string;
}

/**
 * About state: header + title + bio paragraphs + italic quote.
 * This state triggers the aside terminal to appear (handled by the orchestrator).
 */
export function AboutState({
  active,
  header,
  title,
  bioParagraph1,
  bioParagraph2,
  italicQuote,
}: AboutStateProps) {
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

  const stateClass = `${styles.state} ${styles.stateAbout}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const lineClass = revealed ? `${styles.line} ${styles.lineIn}` : styles.line;

  const lineStyle = (index: number): React.CSSProperties | undefined =>
    !reducedMotion
      ? { transitionDelay: `${index * TIMING.LINE_STAGGER_MS}ms` }
      : undefined;

  return (
    <div className={stateClass}>
      <div className={`${styles.aboutHeader} ${lineClass}`} style={lineStyle(0)}>
        {header}
      </div>

      <h2 className={`${styles.aboutTitle} ${lineClass}`} style={lineStyle(1)}>
        {title}
      </h2>

      <p className={`${styles.aboutBody} ${lineClass}`} style={lineStyle(2)}>
        {bioParagraph1}
      </p>

      {bioParagraph2 && (
        <p className={`${styles.aboutBody} ${lineClass}`} style={lineStyle(3)}>
          {bioParagraph2}
        </p>
      )}

      <p
        className={`${styles.aboutItalic} ${lineClass}`}
        style={lineStyle(bioParagraph2 ? 4 : 3)}
      >
        {italicQuote}
      </p>
    </div>
  );
}
