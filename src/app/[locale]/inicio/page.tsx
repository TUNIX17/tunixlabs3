'use client';

import { KineticSwissPage } from '@/components/kinetic-swiss/KineticSwissPage';
import { useLocale } from 'next-intl';

export default function HomePage() {
  const locale = useLocale();
  return <KineticSwissPage locale={locale} />;
}
