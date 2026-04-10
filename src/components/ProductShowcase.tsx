'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * ProductShowcase
 * ----------------------------------------------------------------------------
 * Mosaic of 5 real product screenshots from Tunixlabs portfolio. Replaces the
 * former 3D RobotModel (Three.js, ~2200 LOC, LCP killer).
 *
 * Slot composition (cycle 2):
 *   1. sgmSchwager       — SGM "Bienvenido" hero, the wow shot, LCP priority
 *   2. apoderappDark     — Apoderapp Dashboard Presidencial dark
 *   3. fernandezErp      — Fernandez Metallurgic ERP dashboard dark
 *   4. speakly           — Speakly AI English landing
 *   5. gasDistribution   — BOT_GASCO dashboard anonimizado
 *
 * Previous cycle had two Apoderapp slots and no SIME/Schwager/SOMA
 * representation. User fed back: "hay dos imagenes de apoderap, ninguna de
 * schwager, sime, o soma". SGM (Schwager) is the lead; SIME is represented
 * indirectly through the dark-theme "industrial serious" vibe of the
 * Fernandez ERP (the literal SIME UI can't be shown because of the Codelco
 * attribution rule). SOMA stays excluded because there's no public asset yet.
 *
 * Layouts:
 *   - Desktop (lg+): rotating autoplay 5s, pause-on-hover, dots navigation,
 *     cross-fade via opacity + subtle Ken-Burns zoom on the active layer.
 *     Only slot active visible.
 *   - Tablet (md):   grid 3-up top + 2-up bottom to accommodate 5 slots.
 *   - Mobile (sm):   stack 1x5 vertical, scroll natural, sin carousel.
 *
 * Prioridades de imagen:
 *   - Slot 0 (sgmSchwager) usa `priority` → LCP candidate.
 *   - Slots 1-4 lazy con `loading="lazy"`.
 *
 * Accesibilidad:
 *   - region con aria-label + aria-roledescription="carousel".
 *   - Prev/Next + arrow keys cuando el slot esta focado.
 *   - `prefers-reduced-motion`: desactiva autoplay, desactiva cross-fade,
 *     desactiva Ken-Burns, muestra los 5 slots como grid estatico.
 *   - aria-live="polite" para anunciar el slot activo en rotativo.
 *
 * Performance:
 *   - next/image con `sizes` estricto → sirve webp/avif optimizado via Next.
 *   - aspect-ratio reservado (16/10) para evitar CLS.
 *   - Sin framer-motion, sin libs externas. Solo CSS + React state.
 *
 * I18n keys (`HomePage.productShowcase.slots.<slotKey>.{label,metric}`) son
 * generadas por tunix-cro en paralelo. Usamos `t.has()` de next-intl v4 con
 * fallback a strings hardcoded si la key todavia no existe. Esto evita que el
 * componente explote durante el rollout coordinado.
 */

type ShowcaseSlot = {
  key: string;
  src: string;
  alt: string;
  fallbackLabel: string;
  fallbackMetric: string;
};

const SLOTS: ShowcaseSlot[] = [
  {
    key: 'sgmSchwager',
    src: '/case-studies/sgm-schwager-hero.png',
    alt: 'SGM Schwager — welcome dashboard with 8 operational modules',
    fallbackLabel: 'SGM · Gestion operacional minera',
    fallbackMetric: '8 modulos en produccion',
  },
  {
    key: 'apoderappDark',
    src: '/case-studies/apoderapp-presidenta-dark.png',
    alt: 'Apoderapp presidential dashboard — leadership and engagement KPIs',
    fallbackLabel: 'Apoderapp · Dashboard Presidencial',
    fallbackMetric: 'KPIs liderazgo 96.7% · engagement 89.3%',
  },
  {
    key: 'fernandezErp',
    src: '/case-studies/fernandez-erp-dashboard.png',
    alt: 'Fernandez Metallurgic ERP — dark-theme production dashboard',
    fallbackLabel: 'Fernandez Metallurgic · ERP',
    fallbackMetric: 'Operaciones, proyectos y finanzas en un solo panel',
  },
  {
    key: 'speakly',
    src: '/case-studies/speakly-landing.png',
    alt: 'Speakly landing — AI English learning with Voice AI and personalized paths',
    fallbackLabel: 'Speakly · Ingles con IA',
    fallbackMetric: 'Voice AI + rutas personalizadas',
  },
  {
    key: 'gasDistribution',
    src: '/case-studies/bot-gas-distribution.png',
    alt: 'Gas distribution automation dashboard with code processing analytics',
    fallbackLabel: 'Distribucion de gas · Automatizacion',
    fallbackMetric: '4,040 codigos · 88.7% exito',
  },
];

const ROTATION_INTERVAL_MS = 5000;

type SlotCardProps = {
  slot: ShowcaseSlot;
  index: number;
  active: boolean;
  priority: boolean;
  /** When `true`, the node is part of the rotating desktop stage. */
  hiddenOnRotating: boolean;
  label: string;
  metric: string;
};

function SlotCard({
  slot,
  index,
  active,
  priority,
  hiddenOnRotating,
  label,
  metric,
}: SlotCardProps) {
  return (
    <figure
      className={[
        'product-showcase__slot neu-raised group relative overflow-hidden rounded-2xl',
        hiddenOnRotating ? 'product-showcase__slot--rotating' : '',
        active ? 'is-active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={hiddenOnRotating && !active ? 'true' : undefined}
      data-slot-index={index}
    >
      <div className="product-showcase__frame relative aspect-[16/10] w-full">
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
          className="product-showcase__img object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="neu-pressed inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider sm:text-xs">
          <span className="neu-gradient-text">{label}</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-white drop-shadow-sm sm:text-base">
          {metric}
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * Resolves label + metric for each slot. Uses next-intl if the key exists
 * (detected via t.has), fallback to the slot's hardcoded strings otherwise.
 * next-intl v4 exposes `t.has(key)` as a stable API — no try/catch, no hook
 * rule violation. The `HomePage.productShowcase.slots.<key>` namespace is
 * owned by tunix-cro and lives in parallel to `HomePage.caseStudies`.
 */
function useResolvedSlotCopy(): Array<{ label: string; metric: string }> {
  const t = useTranslations();
  return SLOTS.map((slot) => {
    const baseKey = `HomePage.productShowcase.slots.${slot.key}`;
    const labelKey = `${baseKey}.label`;
    const metricKey = `${baseKey}.metric`;
    const has: ((k: string) => boolean) | undefined =
      typeof (t as unknown as { has?: (k: string) => boolean }).has === 'function'
        ? (t as unknown as { has: (k: string) => boolean }).has
        : undefined;
    let label = slot.fallbackLabel;
    let metric = slot.fallbackMetric;
    if (has && has(labelKey)) label = t(labelKey);
    if (has && has(metricKey)) metric = t(metricKey);
    return { label, metric };
  });
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const copy = useResolvedSlotCopy();

  // Detect prefers-reduced-motion at runtime — if true, we kill autoplay and
  // fall back to a static grid on md+ breakpoints.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Autoplay rotativo (solo desktop lg+ sin reduced-motion y sin pause)
  useEffect(() => {
    if (reducedMotion || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SLOTS.length);
    }, ROTATION_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reducedMotion, isPaused]);

  const goTo = useCallback((i: number) => {
    setActiveIndex(((i % SLOTS.length) + SLOTS.length) % SLOTS.length);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    },
    [activeIndex, goTo]
  );

  return (
    <section
      ref={rootRef}
      className="product-showcase relative w-full"
      aria-label="Tunixlabs product portfolio showcase"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* Mobile (sm): stack 1x5 vertical */}
      <div className="product-showcase__mobile grid grid-cols-1 gap-4 sm:hidden">
        {SLOTS.map((slot, i) => (
          <SlotCard
            key={`mob-${slot.key}`}
            slot={slot}
            index={i}
            active={false}
            priority={i === 0}
            hiddenOnRotating={false}
            label={copy[i].label}
            metric={copy[i].metric}
          />
        ))}
      </div>

      {/* Tablet (md): 3-up row then 2-up row for the 5 slots. */}
      <div className="product-showcase__tablet hidden sm:grid lg:hidden grid-cols-6 gap-4">
        {SLOTS.map((slot, i) => (
          <div
            key={`tab-${slot.key}`}
            className={
              // First 3 slots → 2 cols each (3*2=6); last 2 slots → 3 cols each (2*3=6)
              i < 3 ? 'col-span-2' : 'col-span-3'
            }
          >
            <SlotCard
              slot={slot}
              index={i}
              active={false}
              priority={i === 0}
              hiddenOnRotating={false}
              label={copy[i].label}
              metric={copy[i].metric}
            />
          </div>
        ))}
      </div>

      {/* Desktop (lg+): rotating with cross-fade + Ken-Burns on active.
          If reducedMotion is true, degrade to static 3+2 grid. */}
      <div
        className={[
          'product-showcase__desktop hidden lg:block',
          reducedMotion ? 'product-showcase__desktop--reduced' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {reducedMotion ? (
          <div className="grid grid-cols-6 gap-5">
            {SLOTS.map((slot, i) => (
              <div
                key={`desk-static-${slot.key}`}
                className={i < 3 ? 'col-span-2' : 'col-span-3'}
              >
                <SlotCard
                  slot={slot}
                  index={i}
                  active={false}
                  priority={i === 0}
                  hiddenOnRotating={false}
                  label={copy[i].label}
                  metric={copy[i].metric}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              className="product-showcase__stage relative mx-auto w-full max-w-[640px]"
              aria-live="polite"
            >
              {SLOTS.map((slot, i) => (
                <div
                  key={`desk-rot-${slot.key}`}
                  className={[
                    'product-showcase__layer',
                    i === activeIndex ? 'is-active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    inset: i === 0 ? undefined : 0,
                    opacity: i === activeIndex ? 1 : 0,
                    transition: 'opacity 700ms ease-in-out',
                    pointerEvents: i === activeIndex ? 'auto' : 'none',
                  }}
                >
                  <SlotCard
                    slot={slot}
                    index={i}
                    active={i === activeIndex}
                    priority={i === 0}
                    hiddenOnRotating={false}
                    label={copy[i].label}
                    metric={copy[i].metric}
                  />
                </div>
              ))}
            </div>

            {/* Dots navigation */}
            <div
              className="mt-6 flex items-center justify-center gap-3"
              role="tablist"
              aria-label="Product showcase slides"
            >
              {SLOTS.map((slot, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={`dot-${slot.key}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Show slide ${i + 1}: ${slot.fallbackLabel}`}
                    onClick={() => goTo(i)}
                    className={[
                      'product-showcase__dot h-3 w-3 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      isActive
                        ? 'neu-pressed scale-125'
                        : 'neu-raised opacity-60 hover:opacity-100',
                    ].join(' ')}
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, var(--neu-primary), var(--neu-accent))'
                        : 'var(--neu-bg)',
                    }}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
