'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, animate } from 'motion/react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FiExternalLink, FiArrowRight } from 'react-icons/fi';
import MITCredentialBadge from './MITCredentialBadge';

type Locale = 'es' | 'en';

const COPY = {
  es: {
    backHome: 'Inicio',
    command: 'whoami && cat ./bio.md',
    pathHint: '~/tunix/founder',
    hero: {
      eyebrow: 'QUIÉN CONSTRUYE',
      signature: 'Alejandro Moyano Foncea',
    },
    manifesto: {
      eyebrow: 'CÓMO OPERO',
      title: 'Siete reglas que rigen cada proyecto',
      items: [
        'No demos. Sistemas en producción o nada.',
        'Un cliente a la vez. La atención es el recurso más escaso.',
        'Workflows agénticos, no copy-paste de tutoriales.',
        'El negocio manda. El stack existe para resolverlo.',
        'Cada entrega trae métricas reales, no capturas bonitas.',
        'Handoff completo: código + docs + accesos. Nada de lock-in.',
        'Si falla, arreglo. Responsabilidad de punta a punta.',
      ],
    },
    stats: {
      eyebrow: 'LO QUE SIGNIFICA EN NÚMEROS',
      items: [
        { value: '15', label: 'años corriendo operaciones reales' },
        { value: '7', label: 'sistemas activos en producción' },
        { value: '4', label: 'industrias: minería, educación, energía, logística' },
        { value: '1', label: 'operador con soporte AI nativo' },
      ],
    },
    anchor: {
      eyebrow: 'DÓNDE ENTRENÉ',
      credential: 'MIT Professional Education · AI/ML · 2024',
      cta: 'Ver credencial',
    },
    stackBlock: {
      eyebrow: 'STACK PREFERIDO',
      description:
        'Lo que uso cuando me dejan elegir — sin atarme a religiones de framework.',
      items: [
        'Next.js 14+',
        'TypeScript',
        'PostgreSQL + Prisma',
        'Railway / Docker',
        'Claude Code workflows',
        'Playwright',
        'WhatsApp Cloud API',
        'OpenAI + Gemini',
        'Stripe + Khipu',
      ],
    },
    cta: {
      title: 'Vamos a construir algo real',
      subtitle: 'Si tienes un proceso que sangra tiempo o papel, hablemos.',
      primary: 'Agendar llamada',
      secondary: 'Ver casos en producción',
    },
    linkedinLabel: 'Ver en LinkedIn',
  },
  en: {
    backHome: 'Home',
    command: 'whoami && cat ./bio.md',
    pathHint: '~/tunix/founder',
    hero: {
      eyebrow: 'WHO BUILDS IT',
      signature: 'Alejandro Moyano Foncea',
    },
    manifesto: {
      eyebrow: 'HOW I OPERATE',
      title: 'Seven rules every engagement follows',
      items: [
        'No demos. Production systems or nothing.',
        'One client at a time. Attention is the scarcest resource.',
        'Agentic workflows, not copy-paste of tutorials.',
        'The business leads. The stack exists to serve it.',
        'Every delivery ships with real metrics, not pretty screenshots.',
        'Full handoff: code + docs + access. Zero lock-in.',
        'If it breaks, I fix it. End-to-end accountability.',
      ],
    },
    stats: {
      eyebrow: 'WHAT THAT MEANS IN NUMBERS',
      items: [
        { value: '15', label: 'years running real ops' },
        { value: '7', label: 'live production systems' },
        { value: '4', label: 'industries: mining, education, energy, logistics' },
        { value: '1', label: 'operator with AI-native support' },
      ],
    },
    anchor: {
      eyebrow: 'WHERE I TRAINED',
      credential: 'MIT Professional Education · AI/ML · 2024',
      cta: 'View credential',
    },
    stackBlock: {
      eyebrow: 'PREFERRED STACK',
      description:
        'What I reach for when given the choice — no framework religion.',
      items: [
        'Next.js 14+',
        'TypeScript',
        'PostgreSQL + Prisma',
        'Railway / Docker',
        'Claude Code workflows',
        'Playwright',
        'WhatsApp Cloud API',
        'OpenAI + Gemini',
        'Stripe + Khipu',
      ],
    },
    cta: {
      title: 'Let\u2019s build something real',
      subtitle: 'If you have a process bleeding time or paper, let\u2019s talk.',
      primary: 'Book a call',
      secondary: 'See live cases',
    },
    linkedinLabel: 'View on LinkedIn',
  },
} as const;

function BrandMarkRive() {
  const [ok, setOk] = useState(true);
  const { RiveComponent } = useRive({
    src: '/design-explorations/rive/brand-mark.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setOk(false),
  });
  if (!ok) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="h-14 w-14 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(204,255,0,0.8), rgba(204,255,0,0))',
            boxShadow: '0 0 50px rgba(204,255,0,0.4)',
          }}
        />
      </div>
    );
  }
  return <RiveComponent />;
}

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const numMatch = value.match(/^(\d+)(.*)$/);
    if (!numMatch) return;
    const target = parseInt(numMatch[1], 10);
    const suffix = numMatch[2];
    const controls = animate(0, target, {
      duration: 1.2,
      delay,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest) => setDisplay(`${Math.round(latest)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <div className="font-mono text-6xl font-bold leading-none tracking-tight text-[#ccff00] md:text-7xl lg:text-8xl">
        {display}
      </div>
      <div className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <div
        className="mt-5 h-px w-16 origin-left transform transition-transform duration-700 group-hover:scale-x-150"
        style={{ background: '#ccff00', boxShadow: '0 0 16px rgba(204,255,0,0.6)' }}
      />
    </motion.div>
  );
}

function ManifestoItem({ index, text, delay }: { index: number; text: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative grid grid-cols-[auto_1fr] items-start gap-6 border-b border-white/10 py-6 md:gap-10 md:py-8"
    >
      <span className="font-mono text-sm text-white/30 transition group-hover:text-[#ccff00] md:text-base">
        0{index}
      </span>
      <p className="text-xl leading-relaxed text-white/85 transition group-hover:text-white md:text-2xl md:leading-[1.45]">
        {text}
      </p>
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-[#ccff00] transition-all duration-700 group-hover:w-full"
      />
    </motion.div>
  );
}

export default function AboutPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const t = useTranslations('HomePage.about');
  const k = useTranslations('KineticSwiss.states.about');

  return (
    <article className="relative overflow-x-hidden bg-ink text-white">
      {/* HERO — terminal + portrait split */}
      <header className="relative isolate pt-28 pb-24 md:pt-40 md:pb-32">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[700px] w-[1400px] -translate-x-1/2 blur-[140px] opacity-25"
          style={{
            background:
              'radial-gradient(ellipse, rgba(204,255,0,0.55) 0%, transparent 60%)',
          }}
        />
        {/* Grid background */}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40"
          >
            <Link
              href="/inicio"
              className="transition hover:text-white"
            >
              {copy.backHome}
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#ccff00]">founder</span>
          </motion.div>

          {/* Terminal prompt header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-xs text-white/60 backdrop-blur"
          >
            <span className="text-[#ccff00]">$</span>
            <span>{copy.command}</span>
            <span
              className="inline-block h-4 w-[2px] animate-pulse"
              style={{ background: '#ccff00' }}
            />
          </motion.div>

          <div className="grid grid-cols-12 gap-8 md:gap-12">
            {/* Left: title + bio */}
            <div className="col-span-12 md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40"
              >
                {copy.hero.eyebrow}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
              >
                {t('title').split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.4 + i * 0.04,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    className="mr-[0.25em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
                className="mt-8 max-w-2xl text-base text-white/50 md:text-lg"
              >
                {t('roleLine')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-10 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.6]"
              >
                {t.rich('bioParagraph1', {
                  mit: (chunks) => (
                    <MITCredentialBadge>{chunks as any}</MITCredentialBadge>
                  ),
                })}
              </motion.div>

              <motion.a
                href={t('linkedinUrl')}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-mono text-white/70 transition hover:border-[#ccff00]/40 hover:bg-[#ccff00]/5 hover:text-[#ccff00]"
              >
                {copy.linkedinLabel}
                <FiExternalLink className="h-3.5 w-3.5" />
              </motion.a>
            </div>

            {/* Right: portrait with frame + brand mark */}
            <div className="col-span-12 md:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative"
              >
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(204,255,0,0.06), rgba(255,255,255,0.02))',
                  }}
                >
                  <Image
                    src="/team/alejandro-moyano.png"
                    alt={t('name')}
                    width={720}
                    height={960}
                    priority
                    className="relative h-full w-full object-cover object-top"
                    style={{ filter: 'grayscale(0.08) contrast(1.05)' }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.5))',
                    }}
                  />
                  {/* Portrait metadata overlay */}
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between font-mono text-[10px] text-white/70">
                    <div className="rounded bg-black/50 px-2 py-1 backdrop-blur">
                      {k('asidePath')}
                    </div>
                    <div className="rounded bg-black/50 px-2 py-1 backdrop-blur">
                      REC ·{' '}
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full align-middle"
                        style={{
                          background: '#ef4444',
                          boxShadow: '0 0 6px #ef4444',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating brand-mark badge */}
                <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full border border-white/15 bg-black/80 p-3 backdrop-blur">
                  <BrandMarkRive />
                </div>

                {/* Floating caption */}
                <div className="absolute -right-2 -bottom-6 rounded-lg border border-white/10 bg-ink px-4 py-3 font-mono text-[10px] leading-[1.4] text-white/50">
                  {k('asideCaption').split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* ITALIC QUOTE — editorial pull-quote */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="border-l-2 pl-8 md:pl-12"
          style={{ borderColor: '#ccff00' }}
        >
          <p className="font-serif text-3xl italic leading-[1.35] text-white md:text-5xl md:leading-[1.25]">
            "{k('italicQuote')}"
          </p>
        </motion.blockquote>
      </section>

      {/* SECOND BIO PARAGRAPH */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-lg leading-relaxed text-white/65 md:text-xl md:leading-[1.65]"
        >
          {t('bioParagraph2')}
        </motion.p>
      </section>

      {/* STATS — big kinetic numbers */}
      <section className="relative border-y border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block border-l-2 border-[#ccff00] pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ccff00]"
          >
            {copy.stats.eyebrow}
          </motion.span>
          <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
            {copy.stats.items.map((s, i) => (
              <Stat key={s.label} value={s.value} label={s.label} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO — seven rules */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="inline-block border-l-2 border-[#ccff00] pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ccff00]">
            {copy.manifesto.eyebrow}
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {copy.manifesto.title}
          </h2>
        </motion.div>

        <div className="mt-16">
          {copy.manifesto.items.map((item, i) => (
            <ManifestoItem
              key={i}
              index={i + 1}
              text={item}
              delay={i * 0.08}
            />
          ))}
        </div>
      </section>

      {/* STACK BLOCK */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block border-l-2 border-[#ccff00] pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#ccff00]">
            {copy.stackBlock.eyebrow}
          </span>
          <p className="mt-6 text-lg text-white/60 md:text-xl">
            {copy.stackBlock.description}
          </p>
        </motion.div>

        <div className="mt-12 flex flex-wrap gap-3">
          {copy.stackBlock.items.map((tech, i) => (
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

      {/* CTA — final */}
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
            className="text-4xl font-bold tracking-tight text-white md:text-6xl"
          >
            {copy.cta.title}
          </motion.h2>
          <p className="mt-6 text-lg text-white/60 md:text-xl">{copy.cta.subtitle}</p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-3 rounded-xl bg-[#ccff00] px-7 py-4 font-semibold text-[#0a0a0a] transition hover:-translate-y-0.5 hover:bg-[#b8e600]"
            >
              {copy.cta.primary}
              <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/casos"
              className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-4 font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
            >
              {copy.cta.secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer signature */}
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          Tunix Labs · {locale === 'es' ? 'Hecho en Chile, operando LATAM y USA' : 'Made in Chile, operating LATAM and USA'}
        </p>
      </footer>
    </article>
  );
}
