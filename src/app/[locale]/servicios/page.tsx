import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import JsonLd from '@/components/seo/JsonLd';

/**
 * Services index page (/es/servicios, /en/services).
 *
 * Kept deliberately lean: no client state, no motion choreography yet. The seven
 * service cards point at the real subdirs that already exist under
 * src/app/[locale]/servicios/. When those deep pages ship, this index inherits
 * the linking automatically — slugs are the contract.
 *
 * SEO layer: FAQPage JSON-LD with five pre-qualification questions that we
 * consistently hear from enterprise buyers evaluating a LATAM nearshore partner.
 */

type Locale = 'es' | 'en';

type Service = {
  slug: string;
  titleEs: string;
  titleEn: string;
  taglineEs: string;
  taglineEn: string;
  icon: string;
  color: string;
  metricsEs: string;
  metricsEn: string;
};

// Seven real subdirs verified on disk. Do NOT invent slugs here — the router
// resolves these against src/app/[locale]/servicios/<slug>/page.tsx. Adding a
// slug that has no subdir ships a broken card to prod.
const SERVICES: Service[] = [
  {
    slug: 'asistentes-ia',
    titleEs: 'Asistentes conversacionales y Voice AI',
    titleEn: 'Conversational assistants & Voice AI',
    taglineEs: 'Agentes de voz y chatbots con LLMs frontera — no flujos rígidos.',
    taglineEn: 'Voice agents and chatbots on frontier LLMs — not rigid flows.',
    icon: '🎙️',
    color: '#ccff00',
    metricsEs: '195+ operarios hablan en vez de escribir · <100ms',
    metricsEn: '195+ field workers speak instead of type · sub-100ms',
  },
  {
    slug: 'business-intelligence',
    titleEs: 'Business Intelligence corporativo',
    titleEn: 'Enterprise Business Intelligence',
    taglineEs: 'Dashboards accionables para operaciones mineras, energía y retail.',
    taglineEn: 'Actionable dashboards for mining, energy and retail operations.',
    icon: '📊',
    color: '#0369a1',
    metricsEs: 'KPIs en tiempo real · Power BI / Metabase / custom',
    metricsEn: 'Real-time KPIs · Power BI / Metabase / custom',
  },
  {
    slug: 'consultoria-ia',
    titleEs: 'Consultoría en IA y AI readiness',
    titleEn: 'AI consulting & AI readiness',
    taglineEs: 'Diagnóstico, roadmap y go-to-production. Sin humo, sin POCs eternas.',
    taglineEn: 'Diagnosis, roadmap, and go-to-production. No hype, no endless POCs.',
    icon: '🧭',
    color: '#a855f7',
    metricsEs: 'MIT Professional Ed AI/ML · 15 años operando negocios reales',
    metricsEn: 'MIT Professional Ed AI/ML · 15 years running real ops',
  },
  {
    slug: 'desarrollos-web',
    titleEs: 'Desarrollo web y SaaS B2B',
    titleEn: 'Web development & B2B SaaS',
    taglineEs: 'Next.js + Fastify + Postgres. Sistemas que alguien usa a las 7 AM.',
    taglineEn: 'Next.js + Fastify + Postgres. Systems people open at 7 AM sharp.',
    icon: '🧩',
    color: '#06b6d4',
    metricsEs: '4,000 hojas de ruta/día · Cero papel en faena',
    metricsEn: '4,000 route sheets/day · Zero paper in the field',
  },
  {
    slug: 'machine-learning',
    titleEs: 'Machine Learning aplicado',
    titleEn: 'Applied Machine Learning',
    taglineEs: 'Modelos embebidos en el flujo operativo — no notebooks huérfanos.',
    taglineEn: 'Models embedded in the operational flow — not orphan notebooks.',
    icon: '🧠',
    color: '#ec4899',
    metricsEs: 'Forecasting, clasificación, OCR · Python + PyTorch',
    metricsEn: 'Forecasting, classification, OCR · Python + PyTorch',
  },
  {
    slug: 'rpa',
    titleEs: 'RPA y automatización de procesos',
    titleEn: 'RPA & process automation',
    taglineEs: 'Bots que eliminan reingreso manual entre SAP, Excel y WhatsApp.',
    taglineEn: 'Bots that kill manual re-entry between SAP, Excel and WhatsApp.',
    icon: '⚙️',
    color: '#f97316',
    metricsEs: 'De 5 min a 30 seg por código · 14 rutas activas',
    metricsEn: 'From 5 min to 30 sec per code · 14 active routes',
  },
  {
    slug: 'vision-artificial',
    titleEs: 'Visión artificial',
    titleEn: 'Computer vision',
    taglineEs: 'OCR de campo, detección de objetos y lectura de documentos regulados.',
    taglineEn: 'Field OCR, object detection and regulated-document reading.',
    icon: '👁️',
    color: '#10b981',
    metricsEs: 'Lectura automática de guías, boletas y códigos visuales',
    metricsEn: 'Automatic reading of waybills, receipts and visual codes',
  },
];

const COPY = {
  es: {
    heroBadge: 'Servicios',
    heroTitle: 'Siete prácticas, todas ancladas a producción',
    heroSubtitle:
      'Cada área conecta a un sistema real operando hoy. Si no hay proyecto vivo, no está acá.',
    cta: 'Ver detalle',
    metaTitle: 'Servicios — Tunix Labs | IA, BI, Voice AI, RPA y desarrollo web',
    metaDescription:
      'Siete prácticas de Tunix Labs: asistentes IA, Business Intelligence, consultoría IA, desarrollo web, machine learning, RPA y visión artificial. Todos en producción.',
  },
  en: {
    heroBadge: 'Services',
    heroTitle: 'Seven practices, all anchored in production',
    heroSubtitle:
      'Each area links to a system running today. If there is no live project, it is not here.',
    cta: 'See detail',
    metaTitle: 'Services — Tunix Labs | AI, BI, Voice AI, RPA and web development',
    metaDescription:
      "Seven Tunix Labs practices: AI assistants, Business Intelligence, AI consulting, web development, machine learning, RPA and computer vision. All in production.",
  },
} as const;

const FAQ = {
  es: [
    {
      q: '¿Qué es un asistente de IA Tunix?',
      a: 'Un agente conversacional (voz o texto) construido sobre LLMs frontera — Claude, Gemini — integrado al backend del cliente. No usamos Dialogflow ni Rasa: orquestamos el modelo sobre tu stack actual, con herramientas y memoria explícitas.',
    },
    {
      q: '¿Cuánto cuesta implementar BI corporativo?',
      a: 'Un BI de producción para una operación mediana parte en USD 25k–60k, dependiendo de las fuentes (SAP, Excel, API), profundidad de modelado y plataforma (Power BI, Metabase, custom). Incluye pipelines ETL, modelo dimensional y dashboards accionables.',
    },
    {
      q: '¿Integran con SAP, Oracle u Odoo?',
      a: 'Sí. Nos conectamos vía APIs nativas, OData, RFC o lectura directa a la base cuando el caso lo justifica. Para SAP usamos RFC/BAPIs; para Oracle, REST + JDBC; para Odoo, XML-RPC/JSON-RPC o módulos personalizados.',
    },
    {
      q: '¿Cuál es el timeline típico de un proyecto?',
      a: 'Un MVP en producción toma 6 a 10 semanas. Un sistema completo — con integraciones, RBAC, auditoría y despliegue regulado — entre 3 y 6 meses. Entregamos en sprints de 2 semanas con demo ejecutiva al cierre de cada uno.',
    },
    {
      q: '¿Modelo nearshore desde LATAM?',
      a: 'Sí. Operamos desde Santiago de Chile, zona horaria US Eastern/Central (UTC-3 a -5), facturación en USD. Inglés fluido a nivel ejecutivo y ritmo de entrega equivalente a SF/NYC a 3–5x menos costo.',
    },
  ],
  en: [
    {
      q: 'What is a Tunix AI assistant?',
      a: 'A conversational agent (voice or text) built on frontier LLMs — Claude, Gemini — integrated into the client backend. We do not use Dialogflow or Rasa: we orchestrate the model over your current stack with explicit tools and memory.',
    },
    {
      q: 'What does corporate BI cost?',
      a: 'A production BI for a mid-size operation starts at USD 25k–60k depending on sources (SAP, Excel, API), modeling depth and platform (Power BI, Metabase, custom). It includes ETL pipelines, dimensional model and actionable dashboards.',
    },
    {
      q: 'Do you integrate with SAP, Oracle or Odoo?',
      a: 'Yes. We connect through native APIs, OData, RFC or direct database reads when warranted. For SAP we use RFC/BAPIs; for Oracle, REST + JDBC; for Odoo, XML-RPC/JSON-RPC or custom modules.',
    },
    {
      q: 'Typical project timeline?',
      a: 'An MVP in production takes 6 to 10 weeks. A full system — integrations, RBAC, audit and regulated deployment — between 3 and 6 months. We deliver in two-week sprints with an executive demo at the end of each.',
    },
    {
      q: 'Nearshore from LATAM?',
      a: 'Yes. We operate from Santiago, Chile, in US Eastern/Central time zones (UTC-3 to -5), billing in USD. Executive-level fluent English and delivery pace equivalent to SF/NYC at 3–5x lower cost.',
    },
  ],
} as const;

type Props = { params: { locale: Locale } };

export async function generateMetadata({ params: { locale } }: Props) {
  const copy = COPY[locale] ?? COPY.es;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/servicios`,
      languages: {
        es: '/es/servicios',
        en: '/en/services',
        'x-default': '/es/servicios',
      },
    },
  };
}

export default async function ServiciosIndexPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const copy = COPY[locale] ?? COPY.es;
  const faq = FAQ[locale] ?? FAQ.es;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <JsonLd schema={faqSchema} />
      <main className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <header className="mb-16 max-w-3xl">
          <span className="inline-block rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/60">
            {copy.heroBadge}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-black md:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-5 text-lg text-black/70 md:text-xl">{copy.heroSubtitle}</p>
        </header>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const title = locale === 'en' ? s.titleEn : s.titleEs;
            const tagline = locale === 'en' ? s.taglineEn : s.taglineEs;
            const metrics = locale === 'en' ? s.metricsEn : s.metricsEs;
            return (
              <li key={s.slug}>
                <Link
                  href={`/servicios/${s.slug}` as '/servicios'}
                  className="group relative block h-full rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ borderTop: `4px solid ${s.color}` }}
                >
                  <div className="mb-4 text-3xl" aria-hidden>
                    {s.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-black">{title}</h2>
                  <p className="mt-2 text-sm text-black/70">{tagline}</p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-black/50">
                    {metrics}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-black group-hover:underline"
                    style={{ color: s.color }}
                  >
                    {copy.cta} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
