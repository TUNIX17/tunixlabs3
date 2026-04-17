'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, animate } from 'motion/react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { Link } from '@/i18n/navigation';
import type { Case } from '@/lib/cases-data';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';

type Locale = 'es' | 'en';

type Props = {
  caseData: Case;
  nextCase: Case;
  prevCase: Case;
  locale: Locale;
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

const COPY = {
  es: {
    backToCases: 'Todos los casos',
    role: 'Rol',
    date: 'Fecha',
    stack: 'Stack',
    problem: 'El problema',
    solution: 'Lo que construimos',
    metrics: 'En números',
    gallery: 'Ver el sistema',
    tech: 'Tecnología desplegada',
    relatedService: 'Servicio que lo hizo posible',
    nextCase: 'Siguiente caso',
    prevCase: 'Caso anterior',
    scrollHint: 'scroll',
    inProduction: 'EN PRODUCCIÓN',
    buildSignature: 'Firmado por Tunix Labs',
  },
  en: {
    backToCases: 'All cases',
    role: 'Role',
    date: 'Shipped',
    stack: 'Stack',
    problem: 'The problem',
    solution: 'What we built',
    metrics: 'In numbers',
    gallery: 'See the system',
    tech: 'Technology deployed',
    relatedService: 'Service that made it possible',
    nextCase: 'Next case',
    prevCase: 'Previous case',
    scrollHint: 'scroll',
    inProduction: 'IN PRODUCTION',
    buildSignature: 'Built by Tunix Labs',
  },
} as const;

const SERVICE_LABEL_ES: Record<string, string> = {
  'desarrollos-web': 'Desarrollos web',
  'rpa': 'RPA e integraciones',
  'asistentes-ia': 'Asistentes IA',
  'business-intelligence': 'Business Intelligence',
  'machine-learning': 'Machine learning',
  'vision-artificial': 'Visión artificial',
  'consultoria-ia': 'Consultoría IA',
};
const SERVICE_LABEL_EN: Record<string, string> = {
  'desarrollos-web': 'Web development',
  'rpa': 'RPA & integrations',
  'asistentes-ia': 'AI assistants',
  'business-intelligence': 'Business intelligence',
  'machine-learning': 'Machine learning',
  'vision-artificial': 'Computer vision',
  'consultoria-ia': 'AI consulting',
};

function MetricCounter({
  value,
  label,
  color,
  delay = 0,
}: {
  value: string;
  label: string;
  color: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const numMatch = value.match(/^(\d+(?:[\.,]\d+)?)(.*)$/);
    if (!numMatch) {
      setDisplay(value);
      return;
    }
    const targetNum = parseFloat(numMatch[1].replace(',', '.'));
    const suffix = numMatch[2];
    const controls = animate(0, targetNum, {
      duration: 1.8,
      delay,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest) => {
        const rounded =
          targetNum >= 100 ? Math.round(latest).toString() : latest.toFixed(1);
        setDisplay(`${rounded}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <MetricPulseRive />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          running
        </span>
      </div>
      <div
        className="font-mono text-5xl md:text-7xl font-bold tracking-tight leading-none"
        style={{ color }}
      >
        {display}
      </div>
      <div className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <div
        className="mt-4 h-px w-12 origin-left"
        style={{ background: color, boxShadow: `0 0 20px ${color}` }}
      />
    </motion.div>
  );
}

function ScrollReveal({
  children,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'section';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const Component = Tag === 'section' ? motion.section : motion.div;
  return (
    <Component
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </Component>
  );
}

function GridBackdrop({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18]"
      style={{
        backgroundImage: `
          linear-gradient(${color}15 1px, transparent 1px),
          linear-gradient(90deg, ${color}15 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage:
          'radial-gradient(ellipse 100% 80% at 50% 0%, black 40%, transparent 80%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 100% 80% at 50% 0%, black 40%, transparent 80%)',
      }}
    />
  );
}

/**
 * RelatedServiceVisual — composite tile for the "06 · Servicio" related card.
 * Replaces the old HeroMonitorRive (compose_scene wireframe with colored
 * squares) with a layered CSS + Rive composition:
 *   - Grid backdrop tinted in the case color
 *   - orbit-marker.riv acid ring with 3 dots behind
 *   - Service slug as large display text in the case color
 *   - Vertical accent line
 * Falls back cleanly if the Rive fails to load.
 */
function RelatedServiceVisual({ color, slug }: { color: string; slug: string }) {
  const display = slug.replace(/-/g, ' ');
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10">
      {/* Grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(${color}30 1px, transparent 1px),
            linear-gradient(90deg, ${color}30 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Ambient wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${color}18, transparent 60%)`,
        }}
      />
      {/* Orbit-marker Rive (acid, behind) */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-70">
        <div className="h-[70%] w-[70%]">
          <OrbitMarkerRive />
        </div>
      </div>
      {/* Vertical accent line */}
      <div
        aria-hidden
        className="absolute left-4 top-4 bottom-4 w-px"
        style={{ background: `${color}40` }}
      />
      {/* Corner tick */}
      <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
        live
      </div>
      {/* Service slug display */}
      <div className="absolute inset-x-6 bottom-6">
        <div
          className="font-mono text-lg font-bold uppercase leading-[1.1] tracking-tight md:text-xl"
          style={{ color }}
        >
          {display}
        </div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
          tunix / servicio
        </div>
      </div>
    </div>
  );
}

/**
 * OrbitMarkerRive — acid ring + 3 dots orbiting at 4s/rev.
 * Shared Rive asset used both behind the SectionMarker number (absolute-
 * positioned decoration) and inside RelatedServiceVisual (as the tile's
 * breathing element). Fallback: null (caller handles gracefully).
 */
function OrbitMarkerRive() {
  const [ok, setOk] = useState(true);
  const { RiveComponent } = useRive({
    src: '/rive/cases/orbit-marker.riv',
    autoplay: true,
    animations: 'orbit',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  if (!ok) return null;
  return <RiveComponent />;
}

/**
 * SectionMarker — giant outline number + eyebrow line, with an acid orbit
 * breathing behind the digits. Replaces the inline sticky eyebrow that
 * was overlapping adjacent text columns when labels line-wrapped.
 * Use `variant="sticky"` inside grid layouts where the marker lives in
 * its own column; `variant="inline"` for full-width sections.
 */
function SectionMarker({
  number,
  label,
  color,
  variant = 'sticky',
}: {
  number: string;
  label: string;
  color: string;
  variant?: 'sticky' | 'inline';
}) {
  const container = variant === 'sticky' ? 'sticky top-28 max-w-full' : 'max-w-full';
  return (
    <div className={container}>
      <div className="relative inline-block">
        {/* Orbit-marker Rive behind the number */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-8 h-[130px] w-[130px] opacity-50 md:-left-12 md:-top-10 md:h-[160px] md:w-[160px] lg:h-[180px] lg:w-[180px]"
        >
          <OrbitMarkerRive />
        </div>
        {/* Giant outline number in foreground */}
        <div
          className="relative font-mono font-bold leading-[0.85] tracking-tight text-[64px] md:text-[80px] lg:text-[96px]"
          style={{
            color: 'transparent',
            WebkitTextStroke: `1.2px ${color}70`,
          }}
        >
          {number}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span
          className="inline-block h-px w-8 shrink-0"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em] whitespace-nowrap"
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * SectionDivider — pulsing acid dot centered between two hairlines.
 * Horizontal breathing element placed between major sections to break
 * monotony without adding another block of content.
 */
function SectionDivider({ color }: { color: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex items-center justify-center gap-5 py-2">
        <span className="block h-px w-24 bg-white/10 md:w-40" />
        <span className="relative inline-flex h-2.5 w-2.5" aria-hidden>
          <span
            className="absolute inset-0 animate-ping rounded-full opacity-60"
            style={{ background: color }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          />
        </span>
        <span className="block h-px w-24 bg-white/10 md:w-40" />
      </div>
    </div>
  );
}

/**
 * MetricPulseRive — inline tick that renders `/rive/cases/metric-pulse.riv`.
 * Three concentric acid rings breathing at 60fps (120-frame loop).
 * Color is fixed acid (#ccff00) — brand Tunix signature, intentionally
 * disonant against per-case color. Fallback: CSS animate-ping dot.
 */
function MetricPulseRive() {
  const [ok, setOk] = useState(true);
  const { RiveComponent } = useRive({
    src: '/rive/cases/metric-pulse.riv',
    autoplay: true,
    animations: 'pulse',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  if (!ok) {
    return (
      <span className="relative inline-flex h-3.5 w-3.5 shrink-0" aria-hidden>
        <span
          className="absolute inset-0 animate-ping rounded-full"
          style={{ background: '#ccff00', opacity: 0.4 }}
        />
        <span
          className="relative inline-flex h-3.5 w-3.5 rounded-full"
          style={{ background: '#ccff00', boxShadow: '0 0 10px #ccff00' }}
        />
      </span>
    );
  }
  return (
    <div className="h-7 w-7 shrink-0" aria-hidden>
      <RiveComponent />
    </div>
  );
}

export default function CaseDetail({
  caseData,
  nextCase,
  prevCase,
  locale,
}: Props) {
  const color = CASE_COLORS[caseData.slug] ?? '#ccff00';
  const isES = locale === 'es';
  const copy = COPY[locale];
  const title = isES ? caseData.titleEs : caseData.titleEn;
  const date = isES ? caseData.dateEs : caseData.dateEn;
  const problem = isES ? caseData.problemEs : caseData.problemEn;
  const solution = isES ? caseData.solutionEs : caseData.solutionEn;
  const nextTitle = isES ? nextCase.titleEs : nextCase.titleEn;
  const prevTitle = isES ? prevCase.titleEs : prevCase.titleEn;
  const serviceLabel =
    (isES ? SERVICE_LABEL_ES : SERVICE_LABEL_EN)[caseData.serviceSlug] ??
    caseData.serviceSlug;

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <article ref={scrollRef} className="relative overflow-x-hidden bg-ink text-white">
      {/* Progress bar — hair-thin bar of case color */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
        style={{ background: color, scaleX: progressScale, boxShadow: `0 0 12px ${color}` }}
      />

      {/* HERO — cinematic, awward-grade */}
      <header className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
        <GridBackdrop color={color} />

        {/* Ambient color wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[560px] w-[1200px] -translate-x-1/2 blur-[120px] opacity-30"
          style={{ background: `radial-gradient(ellipse, ${color} 0%, transparent 60%)` }}
        />

        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <ScrollReveal delay={0}>
            <div className="mb-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              <Link
                href="/casos"
                className="inline-flex items-center gap-1.5 transition hover:text-white"
              >
                <FiArrowLeft className="h-3 w-3" />
                {copy.backToCases}
              </Link>
              <span className="text-white/20">/</span>
              <span style={{ color }} className="font-semibold">
                {caseData.slug}
              </span>
            </div>
          </ScrollReveal>

          {/* Case status ticker row */}
          <ScrollReveal delay={0.05}>
            <div className="mb-10 flex flex-wrap items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className="inline-flex items-center gap-2 text-white/60">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                />
                {copy.inProduction}
              </span>
              <span className="text-white/30">—</span>
              <span className="text-white/60">
                <span className="text-white/30">{copy.role}:</span> {caseData.role}
              </span>
              <span className="text-white/30">—</span>
              <span className="text-white/60">
                <span className="text-white/30">{copy.date}:</span> {date}
              </span>
            </div>
          </ScrollReveal>

          {/* Big title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-5xl text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            {title.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.04,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="mr-[0.25em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mt-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30"
          >
            <span className="block h-px w-12" style={{ background: color }} />
            {copy.scrollHint}
          </motion.div>
        </div>
      </header>

      {/* PROBLEM — giant outline marker + serif body */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <ScrollReveal>
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <SectionMarker number="01" label={copy.problem} color={color} variant="sticky" />
            </div>
          </ScrollReveal>
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <ScrollReveal delay={0.15}>
              <p className="text-2xl leading-relaxed text-white/85 md:text-3xl md:leading-[1.35]">
                {problem}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider color={color} />

      {/* SOLUTION — split with monitor visual */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <GridBackdrop color={color} />
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <ScrollReveal>
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <SectionMarker number="02" label={copy.solution} color={color} variant="sticky" />
            </div>
          </ScrollReveal>
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <ScrollReveal delay={0.15}>
              <p className="text-xl leading-relaxed text-white/70 md:text-2xl md:leading-[1.5]">
                {solution}
              </p>
            </ScrollReveal>

            {/* Inline kinetic monitor */}
            <ScrollReveal delay={0.3}>
              <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ background: `linear-gradient(135deg, ${color}08, transparent 60%)` }}
                />
                <Image
                  src={caseData.images[0]}
                  alt={title}
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover"
                />
                {/* Corner tickers */}
                <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  live system
                </div>
                <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] text-white/50 backdrop-blur">
                  {caseData.slug}.tunix
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* METRICS — huge, counter-reveal */}
      <section className="relative border-y border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <SectionMarker number="03" label={copy.metrics} color={color} variant="inline" />
          </ScrollReveal>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {caseData.metrics.map((m, i) => (
              <MetricCounter
                key={m.label}
                value={m.value}
                label={m.label}
                color={color}
                delay={i * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — masonry of webp */}
      {caseData.images.length > 1 && (
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <ScrollReveal>
            <SectionMarker number="04" label={copy.gallery} color={color} variant="inline" />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {caseData.images.map((src, i) => (
              <ScrollReveal key={src} delay={i * 0.08}>
                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <div
                    className="absolute inset-0 z-10 opacity-0 transition group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(180deg, transparent 60%, ${color}15)`,
                    }}
                  />
                  <Image
                    src={src}
                    alt={`${title} — frame ${i + 1}`}
                    width={1600}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute bottom-3 left-3 z-20 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur">
                    {String(i + 1).padStart(2, '0')} / {String(caseData.images.length).padStart(2, '0')}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* TECH STACK */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <ScrollReveal>
          <SectionMarker number="05" label={copy.tech} color={color} variant="inline" />
        </ScrollReveal>

        <div className="mt-12 flex flex-wrap gap-3">
          {caseData.stack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-full border px-5 py-2.5 font-mono text-sm text-white/80 transition hover:-translate-y-0.5"
              style={{
                borderColor: `${color}30`,
                background: `${color}08`,
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </section>

      {/* RELATED SERVICE — Rive of the service */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <GridBackdrop color={color} />
        <ScrollReveal>
          <SectionMarker number="06" label={copy.relatedService} color={color} variant="inline" />
        </ScrollReveal>

        <Link
          href={`/servicios/${caseData.serviceSlug}` as any}
          className="group mt-12 grid grid-cols-12 items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04] md:p-10"
        >
          <div className="col-span-12 md:col-span-4">
            <div className="relative aspect-square w-full max-w-[280px]">
              <RelatedServiceVisual color={color} slug={caseData.serviceSlug} />
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              tunix / servicios
            </div>
            <h3 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              {serviceLabel}
            </h3>
            <p
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color }}
            >
              {isES ? 'Explorar este servicio' : 'Explore this service'}
              <FiArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </p>
          </div>
        </Link>
      </section>

      {/* PREV / NEXT — full-width strips */}
      <nav className="grid grid-cols-1 border-t border-white/10 md:grid-cols-2">
        <Link
          href={`/casos/${prevCase.slug}` as any}
          className="group relative overflow-hidden border-b border-white/10 p-10 transition hover:bg-white/[0.03] md:border-b-0 md:border-r"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            <FiArrowLeft className="h-3 w-3 transition group-hover:-translate-x-1" />
            {copy.prevCase}
          </div>
          <div
            className="mt-4 text-2xl font-semibold text-white/80 transition group-hover:text-white md:text-3xl"
          >
            {prevTitle}
          </div>
          <span
            className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: CASE_COLORS[prevCase.slug] ?? color }}
          >
            {prevCase.slug}
          </span>
        </Link>
        <Link
          href={`/casos/${nextCase.slug}` as any}
          className="group relative overflow-hidden p-10 text-right transition hover:bg-white/[0.03]"
        >
          <div className="flex items-center justify-end gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            {copy.nextCase}
            <FiArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
          </div>
          <div
            className="mt-4 text-2xl font-semibold text-white/80 transition group-hover:text-white md:text-3xl"
          >
            {nextTitle}
          </div>
          <span
            className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: CASE_COLORS[nextCase.slug] ?? color }}
          >
            {nextCase.slug}
          </span>
        </Link>
      </nav>

      {/* Signature footer */}
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          {copy.buildSignature}
        </p>
      </footer>
    </article>
  );
}
