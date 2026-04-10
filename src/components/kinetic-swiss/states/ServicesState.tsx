'use client';

import { useTranslations } from 'next-intl';
import styles from '../kineticSwiss.module.css';

interface ServiceItem {
  num: string;
  title: string;
  anchor: string;
}

interface ServicesStateProps {
  active: boolean;
  /** Lines revealed so far by the content stream engine. */
  streamedLines?: string[];
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
 * Returns the content lines for this state (used by the orchestrator).
 * Line 0 = header, lines 1..N = service cards.
 */
export function getServicesLines(items: ServiceItem[], title: string, count: string, total: string): string[] {
  return [
    `${title} — ${count} ${total}`,
    ...items.map((item) => `${item.num} ${item.title} — ${item.anchor}`),
  ];
}

/**
 * Services state: header with count + asymmetric grid of service cards.
 * Each card has the invert-on-hover treatment (dark bg slides up).
 * Rendering is gated by streamedLines: only items whose line index has
 * been revealed by the content stream engine are visible.
 * All strings from KineticSwiss.states.services i18n namespace.
 */
export function ServicesState({ active, streamedLines }: ServicesStateProps) {
  const t = useTranslations('KineticSwiss.states.services');
  const items = t.raw('items') as ServiceItem[];
  const titleText = t('title.text');
  const countLabel = t('count');
  const totalNumber = t('totalNumber');

  const stateClass = `${styles.state} ${styles.stateServices}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  // When streamedLines is undefined (no streaming active), show nothing.
  // When streamedLines has entries, the index maps: 0 = header, 1+ = service cards.
  const headerRevealed = streamedLines != null && streamedLines.length > 0;

  return (
    <div className={stateClass}>
      {/* Header */}
      <div
        className={`${styles.servicesHead} ${styles.line}${
          headerRevealed ? ` ${styles.lineIn}` : ''
        }`}
      >
        <h2 className={styles.servicesHeadTitle}>{titleText}</h2>
        <div className={styles.servicesCount}>
          {countLabel}
          <strong className={styles.servicesCountNumber}>{totalNumber}</strong>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.servicesGrid}>
        {items.map((item, i) => {
          const spanClass = SVC_CLASS_MAP[i + 1] ?? '';
          // Item i maps to streamedLines index i+1
          const itemRevealed = streamedLines != null && streamedLines.length > i + 1;

          return (
            <div
              key={i}
              className={`${styles.svc} ${spanClass} ${styles.line}${
                itemRevealed ? ` ${styles.lineIn}` : ''
              }`}
            >
              <div className={styles.svcNum}>{item.num}</div>
              <h3 className={styles.svcTitle}>{item.title}</h3>
              <div className={styles.svcMeta}>{item.anchor}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
