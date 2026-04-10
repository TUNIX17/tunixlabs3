'use client';

import { SplitFlapCounter, parseMetricValue } from '../SplitFlapCounter';
import styles from '../kineticSwiss.module.css';

interface Metric {
  label: string;
  value: string;
}

interface CaseTitle {
  text: string;
  copperWords: string;
}

export interface CaseStudyData {
  id: string;
  badge: string;
  title: CaseTitle;
  metrics: Metric[];
  imageRef: string;
  stack: string[];
}

interface CaseStudyStateProps {
  active: boolean;
  /** Single case study — parent iterates t.raw('caseStudies.cases') */
  study: CaseStudyData;
  /** Lines revealed so far by the content stream engine. */
  streamedLines?: string[];
}

/**
 * Returns the content lines for this case study (used by the orchestrator).
 * Line 0 = badge, line 1 = title, line 2 = metrics summary.
 */
export function getCaseStudyLines(study: CaseStudyData): string[] {
  return [
    study.badge,
    study.title.text,
    study.metrics.map((m) => `${m.label}: ${m.value}`).join(' | '),
  ];
}

/** Check if a metric value starts with a number (worth animating). */
function isNumericMetric(value: string): boolean {
  return /^\d/.test(value.replace(/[,$]/g, ''));
}

/**
 * Case study state: badge + giant title + metrics row.
 * Rendering gated by streamedLines from content stream engine.
 * Line 0 = badge, line 1 = title, line 2 = metrics.
 * Numeric metric values use SplitFlapCounter for airport-board count-up.
 */
export function CaseStudyState({ active, study, streamedLines }: CaseStudyStateProps) {
  const stateClass = `${styles.state} ${styles.stateCase}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  const badgeRevealed = streamedLines != null && streamedLines.length > 0;
  const titleRevealed = streamedLines != null && streamedLines.length > 1;
  const metricsRevealed = streamedLines != null && streamedLines.length > 2;

  return (
    <div className={stateClass}>
      {/* Badge */}
      <div
        className={`${styles.caseBadge} ${styles.line}${
          badgeRevealed ? ` ${styles.lineIn}` : ''
        }`}
      >
        {study.badge}
      </div>

      {/* Title */}
      <h2
        className={`${styles.caseTitle} ${styles.line}${
          titleRevealed ? ` ${styles.lineIn}` : ''
        }`}
      >
        {study.title.text}
      </h2>

      {/* Metrics */}
      <div
        className={`${styles.caseMetrics} ${styles.line}${
          metricsRevealed ? ` ${styles.lineIn}` : ''
        }`}
      >
        {study.metrics.map((metric, i) => {
          const numeric = isNumericMetric(metric.value);

          return (
            <div key={i}>
              <div className={styles.caseMetricLabel}>{metric.label}</div>
              <div className={styles.caseMetricValue}>
                {numeric ? (
                  <MetricCounter value={metric.value} active={active && metricsRevealed} />
                ) : (
                  metric.value
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Renders a numeric metric value with split-flap count-up animation. */
function MetricCounter({ value, active }: { value: string; active: boolean }) {
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
