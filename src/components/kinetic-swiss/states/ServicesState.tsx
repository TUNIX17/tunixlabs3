'use client';

import { useTranslations, useLocale } from 'next-intl';
import styles from '../kineticSwiss.module.css';

interface ServiceItem { num: string; title: string; anchor: string }

const SVC_CLASS_MAP: Record<number, string> = {
  1: styles.svc1, 2: styles.svc2, 3: styles.svc3,
  4: styles.svc4, 5: styles.svc5, 6: styles.svc6,
};

const SVC_ROUTES = [
  'asistentes-ia', 'business-intelligence', 'desarrollos-web',
  'consultoria-ia', 'rpa', 'machine-learning', 'vision-artificial',
];

export function ServicesState({ active }: { active: boolean }) {
  const t = useTranslations('KineticSwiss.states.services');
  const locale = useLocale();
  const items = t.raw('items') as ServiceItem[];

  return (
    <div className={`${styles.state} ${styles.stateServices}${active ? ` ${styles.stateActive}` : ''}`}>
      <div
        className={`${styles.servicesHead} ${styles.line}${active ? ` ${styles.lineIn}` : ''}`}
        style={{ transitionDelay: active ? '100ms' : '0ms' }}
      >
        <h2 className={styles.servicesHeadTitle}>{t('title.text')}</h2>
        <div className={styles.servicesCount}>
          {t('count')}
          <strong className={styles.servicesCountNumber}>{t('totalNumber')}</strong>
        </div>
      </div>

      <div className={styles.servicesGrid}>
        {items.map((item, i) => (
          <a
            key={i}
            href={SVC_ROUTES[i] ? `/${locale}/servicios/${SVC_ROUTES[i]}` : undefined}
            className={`${styles.svc} ${SVC_CLASS_MAP[i + 1] ?? ''} ${styles.line}${active ? ` ${styles.lineIn}` : ''}`}
            style={{ transitionDelay: active ? `${(i + 1) * 90 + 100}ms` : '0ms', textDecoration: 'none', color: 'inherit' }}
          >
            <div className={styles.svcNum}>{item.num}</div>
            <h3 className={styles.svcTitle}>{item.title}</h3>
            <div className={styles.svcMeta}>{item.anchor}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
