'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from '@rive-app/react-canvas';
import { Link } from '@/i18n/navigation';
import ServiceIconSvg from '@/components/ServiceIconSvg';

/**
 * ServiceCard — production-grade card for /servicios and the homepage grid.
 *
 * Each card mounts a tiny .riv (<2KB) built programmatically by the sprint-4
 * rivemcp orchestrator. The motion grammar is service-specific (waveform for
 * asistentes-ia, bars+spark for BI, gears for rpa, etc.) and is driven by two
 * bool inputs on the "Card" state machine:
 *
 *   - isVisible  — flipped to true the first time the card enters the viewport
 *                  via IntersectionObserver. Keeps CPU idle on cards still
 *                  below the fold. Never flipped back to false — staying true
 *                  once seen is a feature: if the card scrolls away and back,
 *                  Rive is already warm.
 *   - isHovered  — mirrored from pointer enter/leave. Drives the emphasis
 *                  animation state (one-shot, non-looping).
 *
 * Fallback ladder:
 *   1. Rive fails to load within 2s              → static <ServiceIconSvg/>
 *   2. Runtime error during Rive init            → static <ServiceIconSvg/>
 *   3. state machine input missing at runtime   → Rive still renders, card
 *      degrades to idle-only (no hover emphasis) without throwing.
 *
 * Layout contract: the wrapper is relative + aspect-[3/2] with absolute-inset
 * children so the SVG fallback and the canvas occupy exactly the same box →
 * zero cumulative layout shift across the hand-off.
 */
const STATE_MACHINE = 'Card';
const VISIBLE_INPUT = 'isVisible';
const HOVER_INPUT = 'isHovered';
const LOAD_TIMEOUT_MS = 2000;

interface ServiceCardProps {
  slug: string;
  titleEs: string;
  titleEn: string;
  taglineEs?: string;
  taglineEn?: string;
  metricsEs?: string;
  metricsEn?: string;
  color: string;
  href: string;
  locale?: 'es' | 'en';
  ctaLabel?: string;
}

export default function ServiceCard({
  slug,
  titleEs,
  titleEn,
  taglineEs,
  taglineEn,
  metricsEs,
  metricsEn,
  color,
  href,
  locale = 'es',
  ctaLabel,
}: ServiceCardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [errored, setErrored] = useState<boolean>(false);

  const { rive, RiveComponent } = useRive({
    src: `/rive/services/${slug}.riv`,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => setLoaded(true),
    onLoadError: () => setErrored(true),
  });

  const visibleInput = useStateMachineInput(rive, STATE_MACHINE, VISIBLE_INPUT);
  const hoverInput = useStateMachineInput(rive, STATE_MACHINE, HOVER_INPUT);

  // Fallback timer: if Rive never reports onLoad within the budget, flip to
  // the static SVG. The timer self-clears on actual load to avoid a late flip.
  useEffect(() => {
    if (loaded || errored) return;
    const id = window.setTimeout(() => {
      if (!loaded) setErrored(true);
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [loaded, errored]);

  // IntersectionObserver drives isVisible. Once true we disconnect — the card
  // does not need to track subsequent viewport changes, staying "visible" is
  // cheaper than churning the input on every scroll.
  useEffect(() => {
    if (!visibleInput || !wrapperRef.current) return;
    const target = wrapperRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleInput.value = true;
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [visibleInput]);

  // Explicit teardown — prevents the rive-react memory leak reported in
  // upstream issue #137 when components unmount mid-animation.
  useEffect(() => {
    return () => {
      rive?.cleanup?.();
    };
  }, [rive]);

  const handleEnter = () => {
    if (hoverInput) hoverInput.value = true;
  };
  const handleLeave = () => {
    if (hoverInput) hoverInput.value = false;
  };

  const title = locale === 'en' ? titleEn : titleEs;
  const tagline = locale === 'en' ? taglineEn : taglineEs;
  const metrics = locale === 'en' ? metricsEn : metricsEs;
  const defaultCta = locale === 'en' ? 'See detail' : 'Ver detalle';
  const showFallback = !loaded || errored;

  return (
    <Link
      href={href as never}
      className="group relative block h-full rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ borderTop: `4px solid ${color}` }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div
        ref={wrapperRef}
        className="relative w-full overflow-hidden rounded-xl bg-[#f5f5f2]"
        style={{ aspectRatio: '3 / 2' }}
      >
        {!errored ? (
          <div
            className="absolute inset-0 transition-opacity duration-200"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            <RiveComponent className="h-full w-full" />
          </div>
        ) : null}
        {showFallback ? (
          <div className="absolute inset-0">
            <ServiceIconSvg slug={slug} />
          </div>
        ) : null}
      </div>

      <h2 className="mt-5 text-xl font-semibold text-black">{title}</h2>
      {tagline ? (
        <p className="mt-2 text-sm text-black/70">{tagline}</p>
      ) : null}
      {metrics ? (
        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-black/50">
          {metrics}
        </p>
      ) : null}

      <span
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:underline"
        style={{ color }}
      >
        {ctaLabel ?? defaultCta} →
      </span>
    </Link>
  );
}
