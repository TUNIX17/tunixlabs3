'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TIMING } from '../timing';
import styles from '../kineticSwiss.module.css';

interface Metric {
  value: string;
  label: string;
}

interface CaseStudy {
  badge: string;
  title: string;
  metrics: Metric[];
}

interface CaseStudyStateProps {
  active: boolean;
  study: CaseStudy;
}

/**
 * Case study state: badge + giant title + 3 metrics row.
 */
export function CaseStudyState({ active, study }: CaseStudyStateProps) {
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

  const stateClass = `${styles.state} ${styles.stateCase}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const lineClass = revealed ? `${styles.line} ${styles.lineIn}` : styles.line;

  const lineStyle = (delay: number): React.CSSProperties | undefined =>
    !reducedMotion ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div className={stateClass}>
      {/* Badge */}
      <div
        className={`${styles.caseBadge} ${lineClass}`}
        style={lineStyle(0)}
      >
        {study.badge}
      </div>

      {/* Title */}
      <h2
        className={`${styles.caseTitle} ${lineClass}`}
        style={lineStyle(TIMING.LINE_STAGGER_MS)}
      >
        {study.title}
      </h2>

      {/* Metrics */}
      <div
        className={`${styles.caseMetrics} ${lineClass}`}
        style={lineStyle(TIMING.LINE_STAGGER_MS * 2)}
      >
        {study.metrics.map((metric, i) => (
          <div key={i}>
            <div className={styles.caseMetricLabel}>{metric.label}</div>
            <div className={styles.caseMetricValue}>{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
