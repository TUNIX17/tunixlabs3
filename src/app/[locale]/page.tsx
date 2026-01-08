import { redirect } from '@/i18n/navigation';
import type { Pathnames } from '@/i18n/routing';

export default function LocaleRootPage() {
  redirect({ href: '/inicio' as Pathnames, locale: 'es' });
}
