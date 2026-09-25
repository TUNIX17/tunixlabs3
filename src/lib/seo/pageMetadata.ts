import { getTranslations } from 'next-intl/server';
import type { Pathnames } from '@/i18n/routing';
import { alternatesFor, toLocale } from './alternates';

/**
 * Metadata for the pages that are client components (`'use client'` can't
 * export generateMetadata): each one gets a pass-through layout.tsx that
 * calls this with the `meta` namespace of its messages.
 */
export async function pageMetadata(
  rawLocale: string,
  namespace: string,
  pathname: Pathnames
) {
  const locale = toLocale(rawLocale);
  const t = await getTranslations({ locale, namespace });
  return {
    title: t('title'),
    description: t('description'),
    alternates: alternatesFor(locale, pathname),
  };
}
