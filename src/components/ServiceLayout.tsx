'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheckCircle } from 'react-icons/fi';
import { BsChatDots } from 'react-icons/bs';
import { trackEvent, Events } from '@/lib/analytics/track';
import { useTerminalChat } from '@/components/TerminalChat';
import { CASES } from '@/lib/cases-data';

export type ServiceContent = {
  serviceKey: string;
  ctaHref: string;
};

type Props = {
  service: ServiceContent;
};

// serviceKey (camelCase in i18n) -> slug (kebab-case on disk / routing)
const KEY_TO_SLUG: Record<string, string> = {
  aiAssistants: 'asistentes-ia',
  businessIntelligence: 'business-intelligence',
  aiConsulting: 'consultoria-ia',
  webDev: 'desarrollos-web',
  machineLearning: 'machine-learning',
  rpa: 'rpa',
  computerVision: 'vision-artificial',
};

const CASE_COLORS: Record<string, string> = {
  apoderapp: '#a78bfa',
  fernandez: '#f59e0b',
  schwager: '#fb923c',
  sime: '#84cc16',
  gasco: '#38bdf8',
  soma: '#22d3ee',
  speakly: '#c084fc',
};

const PROCESS_STEPS = {
  es: [
    {
      num: '01',
      title: 'Escuchamos el negocio',
      body: 'Antes de una línea de código, mapeamos el proceso actual, la fricción real y lo que movería el indicador.',
    },
    {
      num: '02',
      title: 'Diseñamos el sistema',
      body: 'Prototipos en bajo costo, no wireframes. Si no funciona en 3 días, el scope está mal planteado.',
    },
    {
      num: '03',
      title: 'Entregamos en producción',
      body: 'Código en tu repo, infra en tu nube, credenciales en tu poder. Cero lock-in, cero dependencia.',
    },
    {
      num: '04',
      title: 'Operamos y medimos',
      body: 'Dashboards reales, no capturas bonitas. Respondemos a fallas y evolucionamos en base a uso real.',
    },
  ],
  en: [
    {
      num: '01',
      title: 'We listen to the business',
      body: 'Before a line of code, we map the current process, real friction and what would move the needle.',
    },
    {
      num: '02',
      title: 'We design the system',
      body: 'Low-cost prototypes, not wireframes. If it does not work in 3 days, the scope is wrong.',
    },
    {
      num: '03',
      title: 'We ship to production',
      body: 'Code in your repo, infra in your cloud, credentials in your hands. Zero lock-in, zero dependency.',
    },
    {
      num: '04',
      title: 'We run and measure',
      body: 'Real dashboards, not pretty screenshots. We respond to failures and evolve based on actual usage.',
    },
  ],
} as const;

const SECTION_COPY = {
  es: {
    processEyebrow: 'CÓMO TRABAJAMOS',
    processTitle: 'Cuatro pasos sin teatro',
    relatedCasesEyebrow: 'DÓNDE LO VIVIMOS',
    relatedCasesTitle: 'Proyectos reales apoyados en este servicio',
    viewCase: 'Ver caso',
    noRelatedCases: 'Este servicio entrará en cartera con el próximo proyecto.',
    anchorEyebrow: 'PROYECTO ANCLA',
    stackEyebrow: 'STACK TÍPICO',
  },
  en: {
    processEyebrow: 'HOW WE WORK',
    processTitle: 'Four steps, no theater',
    relatedCasesEyebrow: 'WHERE IT LIVES',
    relatedCasesTitle: 'Live projects built on this service',
    viewCase: 'View case',
    noRelatedCases: 'This service will enter the portfolio with the next project.',
    anchorEyebrow: 'ANCHOR PROJECT',
    stackEyebrow: 'TYPICAL STACK',
  },
} as const;

/**
 * ServiceHeroVisual — hero tile for a service page.
 * Replaces the old ServiceRive that loaded /rive/services/{slug}.riv —
 * those were compose_scene wireframe placeholders (colored squares) and
 * never carried real design intent. This new composite uses:
 *   - Acid grid backdrop
 *   - orbit-marker.riv acid (shared brand asset) latent in the center
 *   - Four corner brackets (framing signal)
 *   - Fallback: CSS-only if the .riv fails to load (no wireframe ever)
 */
function ServiceHeroVisual() {
  const [ok, setOk] = useState(true);
  const { RiveComponent } = useRive({
    src: '/rive/cases/orbit-marker.riv',
    autoplay: true,
    animations: 'orbit',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  const bracket = '1px solid rgba(204,255,0,0.8)';
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Acid grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(204,255,0,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,255,0,0.35) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Ambient wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(204,255,0,0.12), transparent 65%)',
        }}
      />
      {/* Orbit-marker Rive (centered, breathing) */}
      {ok && (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-80">
          <div className="h-[78%] w-[78%]">
            <RiveComponent />
          </div>
        </div>
      )}
      {/* Corner brackets */}
      <div className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5" style={{ borderLeft: bracket, borderTop: bracket }} />
      <div className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5" style={{ borderRight: bracket, borderTop: bracket }} />
      <div className="pointer-events-none absolute left-3 bottom-3 h-3.5 w-3.5" style={{ borderLeft: bracket, borderBottom: bracket }} />
      <div className="pointer-events-none absolute right-3 bottom-3 h-3.5 w-3.5" style={{ borderRight: bracket, borderBottom: bracket }} />
    </div>
  );
}

export default function ServiceLayout({ service }: Props) {
  const locale = useLocale() as 'es' | 'en';
  const isES = locale === 'es';
  const servicesT = useTranslations(`Services.${service.serviceKey}`);
  const homeServicesT = useTranslations(
    `HomePage.services.items.${service.serviceKey}`
  );
  const layoutT = useTranslations('ServiceLayout');
  const footerT = useTranslations('Footer');
  const { open: openTerminal } = useTerminalChat();

  const slug = KEY_TO_SLUG[service.serviceKey] ?? '';
  const stack = homeServicesT.raw('stack') as string[];
  const sectionCopy = SECTION_COPY[locale];
  const processSteps = PROCESS_STEPS[locale];
  const relatedCases = CASES.filter((c) => c.serviceSlug === slug);

  useEffect(() => {
    trackEvent(Events.PAGE_VIEW_SERVICE, { service: service.serviceKey });
  }, [service.serviceKey]);

  return (
    <article className="relative overflow-x-hidden bg-ink text-white">
      {/* HERO */}
      <header className="relative isolate pt-28 pb-24 md:pt-40 md:pb-32">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[560px] w-[1200px] -translate-x-1/2 blur-[120px] opacity-25"
          style={{
            background:
              'radial-gradient(ellipse, rgba(204,255,0,0.5) 0%, transparent 60%)',
          }}
        />
        {/* Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage:
              'radial-gradient(ellipse 100% 90% at 50% 0%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 100% 90% at 50% 0%, black 30%, transparent 80%)',
          }}
        />

        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40"
          >
            <Link href="/inicio" className="transition hover:text-white">
              {layoutT('backButton')}
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/servicios" className="transition hover:text-white">
              {isES ? 'Servicios' : 'Services'}
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#ccff00]">{slug}</span>
          </motion.div>

          <div className="grid grid-cols-12 gap-8 md:gap-12">
            {/* Left: title + description */}
            <div className="col-span-12 md:col-span-7">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-block rounded-full border border-white/15 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60"
              >
                {servicesT('hero.badge')}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl"
              >
                {servicesT('hero.title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl md:leading-[1.55]"
              >
                {servicesT('hero.description')}
              </motion.p>
            </div>

            {/* Right: Rive of the service */}
            <div className="col-span-12 md:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(204,255,0,0.06), rgba(255,255,255,0.02))',
                }}
              >
                {slug && <ServiceHeroVisual />}
                {/* Corner ticker */}
                <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      background: '#ccff00',
                      boxShadow: '0 0 6px #ccff00',
                    }}
                  />
                  {slug}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* OVERVIEW */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-xl leading-relaxed text-white/75 md:text-2xl md:leading-[1.55]"
        >
          {homeServicesT('longDescription')}
        </motion.p>
      </section>

      {/* PROCESS */}
      <section className="relative border-y border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block border-l-2 border-[#ccff00] pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ccff00]">
              {sectionCopy.processEyebrow}
            </span>
            <h2 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
              {sectionCopy.processTitle}
            </h2>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="relative rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-[#ccff00]/30 hover:bg-white/[0.04]"
              >
                <div className="font-mono text-3xl font-bold text-[#ccff00]">
                  {step.num}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED CASES */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block border-l-2 border-[#ccff00] pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ccff00]">
            {sectionCopy.relatedCasesEyebrow}
          </span>
          <h2 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            {sectionCopy.relatedCasesTitle}
          </h2>
        </motion.div>

        {relatedCases.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            {relatedCases.map((c, i) => {
              const color = CASE_COLORS[c.slug] ?? '#ccff00';
              const title = isES ? c.titleEs : c.titleEn;
              return (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                >
                  <Link
                    href={`/casos/${c.slug}` as any}
                    className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:-translate-y-1 hover:bg-white/[0.04]"
                    style={{ borderTop: `3px solid ${color}` }}
                  >
                    <div
                      className="relative w-full overflow-hidden bg-black/40"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <Image
                        src={c.images[0]}
                        alt={title}
                        width={1600}
                        height={900}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, transparent 55%, ${color}25)`,
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                        {c.slug} · {c.role}
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">
                        {title}
                      </h3>
                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {c.metrics.slice(0, 2).map((m) => (
                            <span
                              key={m.label}
                              className="font-mono text-xs text-white/50"
                            >
                              <strong style={{ color }}>{m.value}</strong>{' '}
                              {m.label.toLowerCase()}
                            </span>
                          ))}
                        </div>
                        <FiArrowUpRight
                          className="h-5 w-5 text-white/40 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                          style={{ color }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-white/50">
            {sectionCopy.noRelatedCases}
          </div>
        )}
      </section>

      {/* ANCHOR PROJECT */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(204,255,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204,255,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage:
              'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12"
        >
          <div className="flex items-center gap-3">
            <span className="inline-block border-l-2 border-[#ccff00] pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ccff00]">
              {sectionCopy.anchorEyebrow}
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-bold text-white md:text-3xl">
            {layoutT('anchorTitle')}
          </h3>
          <div className="mt-6 flex items-start gap-4">
            <FiCheckCircle
              className="mt-1 h-6 w-6 flex-shrink-0 text-[#ccff00]"
              aria-hidden="true"
            />
            <p className="text-base leading-relaxed text-white/70 md:text-lg md:leading-[1.6]">
              {homeServicesT('anchorProject')}
            </p>
          </div>
        </motion.div>
      </section>

      {/* STACK */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block border-l-2 border-[#ccff00] pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ccff00]">
            {sectionCopy.stackEyebrow}
          </span>
          <h2 className="mt-6 text-2xl font-bold text-white/90 md:text-3xl">
            {layoutT('stackTitle')}
          </h2>
        </motion.div>

        <div className="mt-12 flex flex-wrap gap-3">
          {stack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-sm text-white/75 transition hover:-translate-y-0.5 hover:border-[#ccff00]/40 hover:text-[#ccff00]"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/10 py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at bottom, rgba(204,255,0,0.15) 0%, transparent 60%)',
          }}
        />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            {layoutT('ctaTitle')}
          </motion.h2>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              className="group inline-flex items-center gap-3 rounded-xl bg-[#ccff00] px-7 py-4 font-semibold text-[#0a0a0a] transition hover:-translate-y-0.5 hover:bg-[#b8e600] cursor-pointer"
              onClick={() => {
                trackEvent(Events.CTA_WHATSAPP_CLICK, {
                  location: `service:${service.serviceKey}`,
                });
                openTerminal();
              }}
            >
              <BsChatDots className="h-5 w-5" />
              {layoutT('ctaButton')}
            </button>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-4 font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
              onClick={() =>
                trackEvent(Events.CTA_FULL_FORM_CLICK, {
                  location: `service:${service.serviceKey}`,
                })
              }
            >
              {layoutT('ctaSecondary')}
              <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 text-center">
        <p className="mx-auto max-w-3xl px-6 text-xs leading-relaxed text-white/30">
          {footerT('disclaimer')}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          &copy; 2026 · {footerT('copyright')}
        </p>
      </footer>
    </article>
  );
}
