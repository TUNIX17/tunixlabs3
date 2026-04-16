import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import JsonLd from '@/components/seo/JsonLd';

/**
 * About / Sobre page (/es/sobre, /en/about).
 *
 * RSC-only. Mirrors the services-index pattern: locale-branched copy, no
 * useTranslations, setRequestLocale for streaming static rendering.
 *
 * SEO: emits an expanded Person JSON-LD with alumniOf (MIT Professional Ed),
 * hasCredential (Applied Data Science, Machine Learning, Dataiku) and knowsAbout.
 * The `organizationSchema` and simpler `personSchema` that the [locale]/layout
 * already emits stay untouched — this page adds a Person variant with deeper
 * detail bound to this exact URL (url field pegs the canonical locale path).
 */

type Locale = 'es' | 'en';
type Props = { params: { locale: Locale } };

const SITE_URL = 'https://tunixlabs.com';

export async function generateMetadata({ params: { locale } }: Props) {
  const isEs = locale === 'es';
  return {
    title: isEs
      ? 'Sobre | Alejandro Moyano Foncea — Tunix Labs'
      : 'About | Alejandro Moyano Foncea — Tunix Labs',
    description: isEs
      ? 'CEO de Tunix Labs. MIT Professional Education Applied Data Science + Machine Learning. Dataiku certified. Proyectos IA desplegados en LATAM.'
      : 'CEO of Tunix Labs. MIT Professional Education in Applied Data Science and Machine Learning. Dataiku certified. Nearshore AI projects from LATAM to USA.',
    alternates: {
      canonical: isEs ? '/es/sobre' : '/en/about',
      languages: {
        es: '/es/sobre',
        en: '/en/about',
        'x-default': '/es/sobre',
      },
    },
    openGraph: {
      title: isEs
        ? 'Sobre | Alejandro Moyano Foncea — Tunix Labs'
        : 'About | Alejandro Moyano Foncea — Tunix Labs',
      description: isEs
        ? 'CEO de Tunix Labs. MIT Professional Education Applied Data Science + Machine Learning. Dataiku certified.'
        : 'CEO of Tunix Labs. MIT Professional Education in Applied Data Science and Machine Learning. Dataiku certified.',
      images: ['/og/tunixlabs-og.png'],
      type: 'profile',
      locale: isEs ? 'es_CL' : 'en_US',
    },
  };
}

export default async function SobrePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const isEs = locale === 'es';

  const timeline = isEs
    ? [
        {
          year: '2023 — hoy',
          title: 'CEO & Founder, Tunix Labs',
          body:
            'Fundé Tunix Labs para construir software con IA para operaciones reales en LATAM. 7+ clientes activos en minería, educación, retail y SaaS.',
        },
        {
          year: '2023',
          title: 'MIT Professional Education',
          body:
            'Applied Data Science Program y Machine Learning Program. Formación directa con faculty del MIT en métodos de producción.',
        },
        {
          year: '2022',
          title: 'Dataiku Advanced Designer',
          body:
            'Certificación oficial Dataiku. Pipelines de datos y ML en producción sobre plataformas empresariales.',
        },
        {
          year: '2018 — hoy',
          title: 'Implementaciones IA/ML para LATAM',
          body:
            'Lideré despliegues para Apoderapp, SchwagerDigital, SIME, ERP, BOT_GASCO, SOMA y Speakly. Producción, no POCs.',
        },
      ]
    : [
        {
          year: '2023 — present',
          title: 'CEO & Founder, Tunix Labs',
          body:
            'Founded Tunix Labs to ship AI-powered software for real LATAM operations. 7+ active clients across mining, education, retail and SaaS.',
        },
        {
          year: '2023',
          title: 'MIT Professional Education',
          body:
            'Applied Data Science Program and Machine Learning Program. Direct training with MIT faculty on production-grade methods.',
        },
        {
          year: '2022',
          title: 'Dataiku Advanced Designer',
          body:
            'Official Dataiku certification. Data and ML pipelines in production on enterprise platforms.',
        },
        {
          year: '2018 — present',
          title: 'AI/ML deployments across LATAM',
          body:
            'Led deployments for Apoderapp, SchwagerDigital, SIME, ERP, BOT_GASCO, SOMA and Speakly. Production, not POCs.',
        },
      ];

  const credentials = isEs
    ? [
        {
          title: 'MIT Professional Education',
          body: 'Applied Data Science + Machine Learning. Métodos aplicados, no teoría de pizarra.',
        },
        {
          title: 'Dataiku Advanced Designer',
          body: 'Certificación oficial en la plataforma estándar de data science enterprise.',
        },
        {
          title: '7+ años desplegando IA',
          body: 'Sistemas en producción en minería, educación, retail, logística y SaaS B2B.',
        },
      ]
    : [
        {
          title: 'MIT Professional Education',
          body: 'Applied Data Science + Machine Learning. Applied methods, not whiteboard theory.',
        },
        {
          title: 'Dataiku Advanced Designer',
          body: 'Official certification on the enterprise data-science platform of reference.',
        },
        {
          title: '7+ years shipping AI',
          body: 'Production systems in mining, education, retail, logistics and B2B SaaS.',
        },
      ];

  const personSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Alejandro Moyano Foncea',
    jobTitle: 'CEO / Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'Tunix Labs',
      url: SITE_URL,
    },
    url: `${SITE_URL}${isEs ? '/es/sobre' : '/en/about'}`,
    sameAs: ['https://www.linkedin.com/in/alejandromoyanofoncea/'],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Massachusetts Institute of Technology — Professional Education',
        url: 'https://professional.mit.edu/',
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Applied Data Science Program',
        credentialCategory: 'certificate',
        recognizedBy: {
          '@type': 'Organization',
          name: 'MIT Professional Education',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Machine Learning Program',
        credentialCategory: 'certificate',
        recognizedBy: {
          '@type': 'Organization',
          name: 'MIT Professional Education',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Dataiku Advanced Designer',
        credentialCategory: 'certificate',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Dataiku',
        },
      },
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Applied Data Science',
      'Next.js',
      'TypeScript',
      'WhatsApp Business API',
      'SAP Integration',
      'Business Intelligence',
      'RPA',
      'Retrieval-Augmented Generation',
    ],
  };

  return (
    <main className="pt-24 pb-24 bg-ink text-paper">
      <section className="max-w-5xl mx-auto px-6 space-y-16">
        <header className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-acid">
            {isEs ? '// SOBRE EL FUNDADOR' : '// ABOUT THE FOUNDER'}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Alejandro Moyano Foncea
          </h1>
          <p className="text-xl text-paper/70">
            {isEs
              ? 'CEO de Tunix Labs. Construyo software con IA para equipos LATAM.'
              : 'CEO of Tunix Labs. I build AI-powered software for LATAM and US nearshore teams.'}
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-bold mb-4">Bio</h2>
          <p className="text-paper/80 leading-relaxed">
            {isEs
              ? 'Fundador de Tunix Labs. MIT Professional Education en Applied Data Science y Machine Learning. Dataiku certified. Trabajo directamente con CEOs y equipos técnicos, diseñando e implementando sistemas de IA que integran con ERPs, CRMs, WhatsApp y procesos existentes. He liderado implementaciones para clientes en minería, educación, retail y SaaS.'
              : 'Founder of Tunix Labs. MIT Professional Education in Applied Data Science and Machine Learning, Dataiku certified. I work hands-on with CEOs and engineering teams to ship AI systems that integrate with existing ERPs, CRMs, WhatsApp flows and business processes. Deployments in mining, education, retail and SaaS.'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">
            {isEs ? 'Trayectoria' : 'Timeline'}
          </h2>
          <ol className="space-y-6 border-l border-paper/20 pl-6">
            {timeline.map((entry) => (
              <li key={entry.title} className="relative">
                <span className="absolute -left-[29px] top-2 h-2 w-2 rounded-full bg-acid" aria-hidden />
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-acid/80">
                  {entry.year}
                </p>
                <p className="text-lg font-semibold mt-1">{entry.title}</p>
                <p className="text-paper/70 mt-1 leading-relaxed">{entry.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">
            {isEs ? 'Credenciales' : 'Credentials'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {credentials.map((c) => (
              <div
                key={c.title}
                className="border border-paper/15 rounded-lg p-5 hover:border-acid/60 transition-colors"
              >
                <p className="font-semibold text-paper">{c.title}</p>
                <p className="text-sm text-paper/70 mt-2 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-8">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-acid text-ink px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-acid/80 transition-colors"
          >
            {isEs ? 'Hablemos de tu proyecto' : "Let's talk about your project"} →
          </Link>
        </div>
      </section>

      <JsonLd schema={personSchema} />
    </main>
  );
}
