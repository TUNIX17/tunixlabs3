'use client';

import { useLocale } from 'next-intl';
import { KineticSwissPage } from '@/components/kinetic-swiss/KineticSwissPage';

/**
 * Preview route for the Kinetic Swiss v2 redesign.
 * Accessible at /es/inicio-v2 and /en/home-v2.
 * Does NOT touch the existing /inicio or /home routes.
 */
export default function HomeV2Page() {
  const locale = useLocale();
  return <KineticSwissPage locale={locale} />;
}
