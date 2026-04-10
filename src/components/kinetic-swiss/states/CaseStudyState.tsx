'use client';

import { SplitFlapCounter, parseMetricValue } from '../SplitFlapCounter';
import styles from '../kineticSwiss.module.css';

interface Metric { label: string; value: string }
interface CaseTitle { text: string; copperWords: string }

export interface CaseStudyData {
  id: string;
  badge: string;
  title: CaseTitle;
  metrics: Metric[];
  imageRef: string;
  stack: string[];
}

export function CaseStudyState({ active, study }: { active: boolean; study: CaseStudyData }) {
  return (
    <div className={`${styles.state} ${styles.stateCase}${active ? ` ${styles.stateActive}` : ''}`}>
      <div
        className={`${styles.caseBadge} ${styles.line}${active ? ` ${styles.lineIn}` : ''}`}
        style={{ transitionDelay: active ? '100ms' : '0ms' }}
      >
        {study.badge}
      </div>

      <h2
        className={`${styles.caseTitle} ${styles.line}${active ? ` ${styles.lineIn}` : ''}`}
        style={{ transitionDelay: active ? '190ms' : '0ms' }}
      >
        {study.title.text}
      </h2>

      <div
        className={`${styles.caseMetrics} ${styles.line}${active ? ` ${styles.lineIn}` : ''}`}
        style={{ transitionDelay: active ? '280ms' : '0ms' }}
      >
        {study.metrics.map((metric, i) => (
          <div key={i}>
            <div className={styles.caseMetricLabel}>{metric.label}</div>
            <div className={styles.caseMetricValue}>
              {/^\d/.test(metric.value.replace(/[,$]/g, '')) ? (
                <SplitFlapCounter {...parseMetricValue(metric.value)} active={active} />
              ) : metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
