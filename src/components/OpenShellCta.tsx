'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from '@rive-app/react-canvas';

/**
 * OpenShellCta — sticky bottom-right "open a shell" call-to-action.
 *
 * Sprint-4 brief: scrollY > 200 → show → click fires Rive `click` trigger on
 * the `OpenShell` state machine AND plays /audio/tick.ogg through the host
 * AudioContext (resumed inside the same user gesture, per Safari iOS policy).
 *
 * This component is intentionally double-gated:
 *   - NEXT_PUBLIC_CTA_AUDIO !== '1'   → plain button (no Rive, no audio, no
 *                                       WASM). On the sprint-4 build host
 *                                       (ffmpeg unavailable) this is the
 *                                       default path.
 *   - flag === '1', Rive errors/hangs → plain button (2s timeout guard).
 *   - flag === '1', audio fetch 404   → Rive visual still works; audio stays
 *                                       silent. No throw.
 *   - prefers-reduced-motion: reduce  → plain button, no audio. Respects
 *                                       WCAG 2.2.2.
 *
 * Bundle hygiene: this whole component is dynamic-imported in layout.tsx with
 * `ssr: false`, so when the flag is 0 the pill renders as a native <button>
 * without ever paying for Rive's client chunk.
 *
 * Analytics: `window.plausible('open_shell_cta')` is called on every click
 * regardless of flag state — that way the conversion signal survives builds
 * that disable audio. Guarded with `typeof` to avoid SSR crashes.
 */
const STATE_MACHINE = 'OpenShell';
const CLICK_INPUT = 'click';
const HOVER_INPUT = 'isHovered';
const LOAD_TIMEOUT_MS = 2000;
const SCROLL_REVEAL_PX = 200;
const AUDIO_URL = '/audio/tick.ogg';

function readAudioFlag(): boolean {
  return process.env.NEXT_PUBLIC_CTA_AUDIO === '1';
}

function canUseWebAudio(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    typeof window.AudioContext !== 'undefined' ||
    typeof (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext !== 'undefined'
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ===
    true;
}

export interface OpenShellCtaProps {
  label?: string;
  ariaLabel?: string;
  href?: string;
}

export default function OpenShellCta({
  label = 'open a shell',
  ariaLabel = 'Open a shell — start terminal conversation',
  href = '#sec-contact',
}: OpenShellCtaProps) {
  const audioFlag = useMemo(() => readAudioFlag(), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const audioOn = audioFlag && !reduced && canUseWebAudio();

  const [visible, setVisible] = useState<boolean>(false);
  const [riveLoaded, setRiveLoaded] = useState<boolean>(false);
  const [riveErrored, setRiveErrored] = useState<boolean>(!audioFlag);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioFailedRef = useRef<boolean>(false);

  // Only mount the Rive hook when the audio flag is on — otherwise the hook
  // still pays the WASM bundle cost on paint. useRive accepts src=undefined,
  // which short-circuits the internal load path.
  const { rive, RiveComponent } = useRive(
    audioFlag
      ? {
          src: '/rive/open-shell.riv',
          stateMachines: STATE_MACHINE,
          autoplay: true,
          layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
          onLoad: () => setRiveLoaded(true),
          onLoadError: () => setRiveErrored(true),
        }
      : {},
  );

  const clickTrigger = useStateMachineInput(rive, STATE_MACHINE, CLICK_INPUT);
  const hoverInput = useStateMachineInput(rive, STATE_MACHINE, HOVER_INPUT);

  // 2-second load timeout — if Rive hasn't reported onLoad by then we degrade
  // to the plain button. Leaving this infinite was observed to keep the Rive
  // canvas in a "loading" state forever when the WASM blob 404s silently.
  useEffect(() => {
    if (!audioFlag || riveLoaded || riveErrored) return;
    const id = window.setTimeout(() => {
      if (!riveLoaded) setRiveErrored(true);
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [audioFlag, riveLoaded, riveErrored]);

  // Scroll-based reveal — hidden until the user is past the hero (≈200px),
  // which avoids the sticky CTA competing with the hero CTAs above the fold.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_REVEAL_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rive cleanup — mirrors the hero pattern to avoid the upstream react-canvas
  // leak when the component unmounts mid-animation.
  useEffect(() => {
    return () => {
      rive?.cleanup?.();
      audioCtxRef.current?.close().catch(() => {
        /* noop: context already closed */
      });
    };
  }, [rive]);

  const playTick = useCallback(async () => {
    if (!audioOn || audioFailedRef.current) return;
    try {
      const AudioCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtor();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        // MUST be awaited synchronously inside the gesture path on iOS Safari
        // or subsequent .start() calls fire on a still-suspended context.
        await ctx.resume();
      }
      if (!audioBufferRef.current) {
        const res = await fetch(AUDIO_URL);
        if (!res.ok) {
          audioFailedRef.current = true;
          return;
        }
        const bytes = await res.arrayBuffer();
        audioBufferRef.current = await ctx.decodeAudioData(bytes);
      }
      const src = ctx.createBufferSource();
      src.buffer = audioBufferRef.current;
      src.connect(ctx.destination);
      src.start();
    } catch {
      audioFailedRef.current = true;
    }
  }, [audioOn]);

  const trackPlausible = useCallback(() => {
    const p = (window as unknown as { plausible?: (e: string) => void })
      .plausible;
    if (typeof p === 'function') {
      try {
        p('open_shell_cta');
      } catch {
        /* analytics is never allowed to throw into UI */
      }
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (clickTrigger) clickTrigger.fire();
      trackPlausible();
      void playTick();
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [clickTrigger, href, playTick, trackPlausible],
  );

  const handleMouseEnter = () => {
    if (hoverInput) hoverInput.value = true;
  };
  const handleMouseLeave = () => {
    if (hoverInput) hoverInput.value = false;
  };

  const containerClass = [
    'fixed bottom-6 right-6 z-50 transition-all duration-300',
    visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4',
  ].join(' ');

  const showRive = audioFlag && !riveErrored;
  const commonButtonProps = {
    'data-testid': 'open-shell-cta',
    'aria-label': ariaLabel,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
  };

  return (
    <div className={containerClass}>
      {showRive ? (
        <button
          type="button"
          onClick={handleClick}
          className="relative h-10 w-[120px] overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          {...commonButtonProps}
        >
          <RiveComponent className="h-full w-full" />
          <span className="sr-only">{label}</span>
        </button>
      ) : (
        <a
          href={href}
          onClick={handleClick}
          className="group inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 font-mono text-xs text-white shadow-lg transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          {...commonButtonProps}
        >
          <span
            className="h-2 w-2 rounded-full bg-[#ccff00] transition-opacity group-hover:opacity-60"
            aria-hidden
          />
          <span className="text-white/70">&gt;</span>
          <span>{label}</span>
        </a>
      )}
    </div>
  );
}
