import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { CASES, type Case } from '@/lib/cases-data';
import { blurMap } from '@/generated/blurMap';
import JsonLd from '@/components/seo/JsonLd';
import { routing } from '@/i18n/routing';

/**
 * Dynamic case study page: /es/casos/[slug] and /en/cases/[slug].
 *
 * RSC-only. Renders 14 static paths at build time (7 cases x 2 locales).
 * Emits Article JSON-LD with Person author + publisher fallback to the OG bitmap.
 *
 * blurMap keyed by legacy `./cases --show <slug>` convention (sprint-1). The map
 * only covers images for which a sidecar bitmap exists; pages without a hit fall
 * through to placeholder='empty' to avoid shipping a broken blurDataURL.
 */

type Locale = (typeof routing.locales)[number];

type Params = { locale: Locale; slug: string };

const SITE_URL = 'https://tunixlabs.com';

function findCase(slug: string): Case | undefined {
  return CASES.find((c) => c.slug === slug);
}

function absolute(url: string): string {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

export function generateStaticParams(): Array<{ locale: Locale; slug: string }> {
  // 7 cases x 2 locales = 14 entries. Flat to match Next.js static params shape.
  return CASES.flatMap((c) =>
    routing.locales.map((locale) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: Params;
}) {
  const c = findCase(slug);
  if (!c) return {};

  const title = locale === 'en' ? c.titleEn : c.titleEs;
  const description = (locale === 'en' ? c.problemEn : c.problemEs).slice(0, 200);
  const ogImage = absolute(c.images[0]);

  // Keep both locale slugs identical (case slugs do not translate). Alternate
  // path prefix differs because of next-intl pathnames (/casos vs /cases).
  return {
    title: `${title} — Tunix Labs`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: ogImage }],
    },
    alternates: {
      canonical: `/${locale}/${locale === 'en' ? 'cases' : 'casos'}/${c.slug}`,
      languages: {
        es: `/es/casos/${c.slug}`,
        en: `/en/cases/${c.slug}`,
        'x-default': `/es/casos/${c.slug}`,
      },
    },
  };
}

export default async function CasoPage({ params: { locale, slug } }: { params: Params }) {
  setRequestLocale(locale);

  const c = findCase(slug);
  if (!c) notFound();

  const isEs = locale === 'es';
  const title = isEs ? c.titleEs : c.titleEn;
  const date = isEs ? c.dateEs : c.dateEn;
  const problem = isEs ? c.problemEs : c.problemEn;
  const solution = isEs ? c.solutionEs : c.solutionEn;
  const ctaLabel = isEs ? 'Ver servicio relacionado' : 'Related service';
  const problemHeading = isEs ? 'Problema' : 'Problem';
  const solutionHeading = isEs ? 'Solucion' : 'Solution';
  const blurKey = `./cases --show ${c.slug}`;
  const blurDataURL = blurMap[blurKey];

  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    author: {
      '@type': 'Person',
      name: 'Alejandro Moyano Foncea',
      url: `${SITE_URL}/sobre`,
    },
    datePublished: '2024-06-01T00:00:00Z',
    image: absolute(c.images[0]),
    publisher: {
      '@type': 'Organization',
      name: 'Tunix Labs',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og/tunixlabs-og.png`,
      },
    },
    description: problem.slice(0, 200),
  };

  return (
    <main className="pt-24 pb-24 bg-ink text-paper">
      <section className="container max-w-5xl mx-auto px-6">
        <span className="inline-block font-mono text-acid text-xs uppercase tracking-[0.2em]">
          {c.role}
        </span>
        <h1 className="mt-5 text-5xl font-bold tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm font-mono opacity-60">{date}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {c.stack.map((tech) => (
            <li
              key={tech}
              className="font-mono text-xs border border-paper/20 rounded-full px-3 py-1 text-paper/80"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {c.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${title} — imagen ${i + 1}`}
              width={800}
              height={500}
              {...(blurDataURL
                ? { placeholder: 'blur' as const, blurDataURL }
                : { placeholder: 'empty' as const })}
              className="rounded-lg object-cover w-full h-auto"
            />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {c.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-paper/10 p-4 flex flex-col gap-2"
            >
              <span className="opacity-60 text-xs uppercase tracking-wider">{m.label}</span>
              <span className="text-3xl font-bold text-acid">{m.value}</span>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">{problemHeading}</h2>
          <p className="mt-4 text-base leading-relaxed text-paper/80">{problem}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">{solutionHeading}</h2>
          <p className="mt-4 text-base leading-relaxed text-paper/80">{solution}</p>
        </section>

        <div className="mt-16">
          <Link
            href={`/servicios/${c.serviceSlug}` as '/servicios'}
            className="inline-flex items-center gap-2 font-mono text-sm text-acid hover:underline"
          >
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <JsonLd schema={articleSchema} />
    </main>
  );
}
