import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import LegalIdentity from '@/components/LegalIdentity';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Placeholder de la web personal (F0). El contenido real llega en F2.
 * LegalIdentity debe seguir en el HTML del servidor de todas las páginas.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <>
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px 16px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '40rem' }}>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.75rem' }}>{t('name')}</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>{t('tagline')}</p>
        </div>
      </main>
      <footer style={{ padding: '0 0 24px' }}>
        <LegalIdentity />
      </footer>
    </>
  );
}
