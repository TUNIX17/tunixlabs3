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
  study: CaseStudyData;
}

/** Check if a metric value starts with a number (worth animating). */
function isNumericMetric(value: string): boolean {
  return /^\d/.test(value.replace(/[,$]/g, ''));
}

export function CaseStudyState({ active, study }: CaseStudyStateProps) {
  const stateClass = `${styles.state} ${styles.stateCase}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  return (
    <div className={stateClass}>
      {/* Badge */}
      <div
        className={`${styles.caseBadge} ${styles.line}${
          active ? ` ${styles.lineIn}` : ''
        }`}
        style={{ transitionDelay: active ? '100ms' : '0ms' }}
      >
        {study.badge}
      </div>

      {/* Title */}
      <h2
        className={`${styles.caseTitle} ${styles.line}${
          active ? ` ${styles.lineIn}` : ''
        }`}
        style={{ transitionDelay: active ? '190ms' : '0ms' }}
      >
        {study.title.text}
      </h2>

      {/* Metrics */}
      <div
        className={`${styles.caseMetrics} ${styles.line}${
          active ? ` ${styles.lineIn}` : ''
        }`}
        style={{ transitionDelay: active ? '280ms' : '0ms' }}
      >
        {study.metrics.map((metric, i) => {
          const numeric = isNumericMetric(metric.value);

          return (
            <div key={i}>
              <div className={styles.caseMetricLabel}>{metric.label}</div>
              <div className={styles.caseMetricValue}>
                {numeric ? (
                  <MetricCounter value={metric.value} active={active} />
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
