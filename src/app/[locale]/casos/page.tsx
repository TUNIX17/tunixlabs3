import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { CASES } from '@/lib/cases-data';

type Locale = 'es' | 'en';

const COPY = {
  es: {
    heroBadge: 'Casos',
    heroTitle: 'Siete sistemas en producción',
    heroSubtitle:
      'No demos. No prototipos. Cada caso es un sistema que alguien usa hoy — antes del café.',
    cta: 'Ver caso',
    metaTitle: 'Casos de éxito — Tunix Labs | IA, BI, Voice AI en producción',
    metaDescription:
      'Siete sistemas en producción: Voice AI en minería, SaaS educativo, BI operacional, bots de WhatsApp y más. Todos construidos por Tunix Labs.',
  },
  en: {
    heroBadge: 'Cases',
    heroTitle: 'Seven systems in production',
    heroSubtitle:
      'No demos. No prototypes. Every case is a system someone uses today — before coffee.',
    cta: 'View case',
    metaTitle: 'Case studies — Tunix Labs | AI, BI, Voice AI in production',
    metaDescription:
      'Seven production systems: mining Voice AI, education SaaS, operational BI, WhatsApp bots and more. All built by Tunix Labs.',
  },
} as const;

const CASE_COLORS: Record<string, string> = {
  apoderapp: '#5b21b6',
  fernandez: '#92400e',
  schwager: '#b85c38',
  sime: '#2d5a27',
  gasco: '#0369a1',
  soma: '#0369a1',
  speakly: '#7c3aed',
};

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props) {
  const copy = COPY[locale] ?? COPY.es;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/casos`,
      languages: {
        es: '/es/casos',
        en: '/en/cases',
        'x-default': '/es/casos',
      },
    },
  };
}

export default async function CasosIndexPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const isES = locale === 'es';
  const copy = COPY[locale] ?? COPY.es;

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <header className="mb-16 max-w-3xl">
        <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50 font-mono">
          {copy.heroBadge}
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
          {copy.heroTitle}
        </h1>
        <p className="mt-5 text-lg text-white/60 md:text-xl">{copy.heroSubtitle}</p>
      </header>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CASES.map((c) => {
          const title = isES ? c.titleEs : c.titleEn;
          const color = CASE_COLORS[c.slug] ?? '#ccff00';
          return (
            <li key={c.slug}>
              <Link
                href={`/casos/${c.slug}` as any}
                className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/8 hover:shadow-xl hover:shadow-white/5"
                style={{ borderTop: `4px solid ${color}` }}
              >
                {/* Case image */}
                <div className="relative w-full overflow-hidden bg-black/40" style={{ aspectRatio: '1600/870' }}>
                  <Image
                    src={c.images[0]}
                    alt={title}
                    width={1600}
                    height={870}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: 'brightness(0.9) contrast(1.05)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className="absolute bottom-3 left-4 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.15em]"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                  >
                    {c.role}
                  </span>
                </div>

                {/* Text content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white leading-snug">{title}</h2>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.stack.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-mono text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    {c.metrics.slice(0, 2).map((m) => (
                      <span
                        key={m.label}
                        className="text-xs font-mono text-white/40"
                      >
                        <strong className="text-white/70">{m.value}</strong>{' '}
                        {m.label.toLowerCase()}
                      </span>
                    ))}
                  </div>
                  <span
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:underline"
                    style={{ color }}
                  >
                    {copy.cta} →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
