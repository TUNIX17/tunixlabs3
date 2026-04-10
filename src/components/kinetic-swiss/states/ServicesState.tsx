'use client';

import { useTranslations, useLocale } from 'next-intl';
import styles from '../kineticSwiss.module.css';

interface ServiceItem {
  num: string;
  title: string;
  anchor: string;
}

interface ServicesStateProps {
  active: boolean;
}

const SVC_CLASS_MAP: Record<number, string> = {
  1: styles.svc1,
  2: styles.svc2,
  3: styles.svc3,
  4: styles.svc4,
  5: styles.svc5,
  6: styles.svc6,
};

/** Map service index to route path */
const SVC_ROUTES = [
  'asistentes-ia',
  'business-intelligence',
  'desarrollos-web',
  'consultoria-ia',
  'rpa',
  'machine-learning',
  'vision-artificial',
];

export function ServicesState({ active }: ServicesStateProps) {
  const t = useTranslations('KineticSwiss.states.services');
  const locale = useLocale();
  const items = t.raw('items') as ServiceItem[];
  const titleText = t('title.text');
  const countLabel = t('count');
  const totalNumber = t('totalNumber');

  const stateClass = `${styles.state} ${styles.stateServices}${
    active ? ` ${styles.stateActive}` : ''
  }`;

  return (
    <div className={stateClass}>
      {/* Header */}
      <div
        className={`${styles.servicesHead} ${styles.line}${
          active ? ` ${styles.lineIn}` : ''
        }`}
        style={{ transitionDelay: active ? '100ms' : '0ms' }}
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
          const route = SVC_ROUTES[i];
          const href = route ? `/${locale}/servicios/${route}` : undefined;

          return (
            <a
              key={i}
              href={href}
              className={`${styles.svc} ${spanClass} ${styles.line}${
                active ? ` ${styles.lineIn}` : ''
              }`}
              style={{ transitionDelay: active ? `${(i + 1) * 90 + 100}ms` : '0ms', textDecoration: 'none', color: 'inherit' }}
            >
              <div className={styles.svcNum}>{item.num}</div>
              <h3 className={styles.svcTitle}>{item.title}</h3>
              <div className={styles.svcMeta}>{item.anchor}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
