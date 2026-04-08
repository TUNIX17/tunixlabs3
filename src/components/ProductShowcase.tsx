'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * ProductShowcase
 * ----------------------------------------------------------------------------
 * Reemplazo del 3D RobotModel (Three.js, ~2200 LOC) por un mosaic de 4
 * screenshots reales de productos Tunixlabs. Diseñado para LCP bajo:
 *
 *   - Desktop (lg+): rotating autoplay 5s, pause-on-hover, dots navigation,
 *     cross-fade via opacity. Solo slot activo visible.
 *   - Tablet (md):   grid 2x2 estatico, todos los slots render en una sola vista.
 *   - Mobile (sm):   stack 1x4 vertical, scroll natural, sin carousel.
 *
 * Prioridades de imagen:
 *   - Slot 0 (Apoderapp landing-hero) usa `priority` → LCP candidate.
 *   - Slots 1-3 lazy con `loading="lazy"`.
 *
 * Accesibilidad:
 *   - region con aria-label + aria-roledescription="carousel".
 *   - Prev/Next + arrow keys cuando el slot esta focado.
 *   - `prefers-reduced-motion`: desactiva autoplay, desactiva cross-fade,
 *     muestra los 4 slots como grid 2x2 (equivale al layout tablet).
 *   - aria-live="polite" para anunciar el slot activo en rotativo.
 *
 * Performance:
 *   - next/image con `sizes` estricto → sirve webp/avif optimizado via Next.
 *   - aspect-ratio reservado (1280/800) para evitar CLS.
 *   - Sin framer-motion, sin libs externas. Solo CSS + React state.
 *
 * El i18n keys (`HomePage.caseStudies.cards.{key}`) son generados por tunix-cro
 * en paralelo. Si todavia no existen, fallback a labels hardcoded via try/catch
 * con defaultMessages. next-intl lanza si la key no existe; usamos
 * `useTranslations` con default namespace + lookup defensivo.
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
    key: 'apoderapp',
    src: '/case-studies/apoderapp-landing-hero.png',
    alt: 'Apoderapp landing — Chilean tax compliance SaaS with SII DTE in production',
    fallbackLabel: 'Chilean tax compliance SaaS',
    fallbackMetric: 'SII DTE certified in production',
  },
  {
    key: 'apoderappFeatures',
    src: '/case-studies/apoderapp-features.png',
    alt: 'Apoderapp features grid — 8 core product capabilities',
    fallbackLabel: 'Feature-rich platform',
    fallbackMetric: '8 core capabilities shipped',
  },
  {
    key: 'speakly',
    src: '/case-studies/speakly-landing.png',
    alt: 'Speakly landing — AI English learning with Voice AI and personalized paths',
    fallbackLabel: 'AI English learning',
    fallbackMetric: 'Voice AI + personalized paths',
  },
  {
    key: 'gasDistribution',
    src: '/case-studies/bot-gas-distribution.png',
    alt: 'Gas distribution automation dashboard with code processing analytics',
    fallbackLabel: 'Gas distribution automation',
    fallbackMetric: '4,040 codes · 88.7% success',
  },
];

const ROTATION_INTERVAL_MS = 5000;

type SlotCardProps = {
  slot: ShowcaseSlot;
  index: number;
  active: boolean;
  priority: boolean;
  /** Cuando `true`, el nodo se renderiza con display: none para
   * tablet/desktop rotativo. */
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
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
          className="object-cover object-top"
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
 * Resuelve label + metric para cada slot. Usa next-intl si la key existe
 * (detectado via t.has), fallback a los strings hardcoded del slot si no.
 * next-intl v4 expone `t.has(key)` de forma estable — no usamos try/catch
 * ni violamos reglas de hooks.
 */
function useResolvedSlotCopy(): Array<{ label: string; metric: string }> {
  const t = useTranslations();
  return SLOTS.map((slot) => {
    const baseKey = `HomePage.caseStudies.cards.${slot.key}`;
    const labelKey = `${baseKey}.label`;
    const metricKey = `${baseKey}.metric`;
    // next-intl v4: t.has() devuelve boolean sin throw.
    // Si el hook no expone has (pre-v4), el typeof check lo desactiva
    // y caemos a fallback silenciosamente.
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

  // Detectar prefers-reduced-motion (runtime) — si true, apagamos autoplay
  // y dejamos el grid 2x2 estatico activo en todos los breakpoints md+.
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
      {/* Mobile (sm): stack 1x4 vertical */}
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

      {/* Tablet (md): grid 2x2 estatico */}
      <div className="product-showcase__tablet hidden sm:grid lg:hidden grid-cols-2 gap-4">
        {SLOTS.map((slot, i) => (
          <SlotCard
            key={`tab-${slot.key}`}
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

      {/* Desktop (lg+): rotativo con cross-fade.
          Si reducedMotion es true, degradamos a grid 2x2. */}
      <div
        className={[
          'product-showcase__desktop hidden lg:block',
          reducedMotion ? 'product-showcase__desktop--reduced' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {reducedMotion ? (
          <div className="grid grid-cols-2 gap-5">
            {SLOTS.map((slot, i) => (
              <SlotCard
                key={`desk-static-${slot.key}`}
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
                    transition: 'opacity 600ms ease-in-out',
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
                        ? 'neu-pressed scale-110'
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
