'use client';

import { useEffect, type RefObject } from 'react';
import { TIMING } from '../timing';

/**
 * Applies a subtle mouse-following parallax transform to the referenced element.
 * Uses rAF throttling so it never fires more than once per frame.
 * Automatically no-ops when `enabled` is false.
 */
export function useCursorParallax(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean
): void {
  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const x =
          (e.clientX / window.innerWidth - 0.5) * TIMING.PARALLAX_MAX_X_PX;
        const y =
          (e.clientY / window.innerHeight - 0.5) * TIMING.PARALLAX_MAX_Y_PX;

        el.style.transition = `transform ${TIMING.PARALLAX_DURATION_MS}ms ${TIMING.PARALLAX_EASING}`;
        el.style.transform = `translate(${x}px, ${y}px)`;
        ticking = false;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (el) {
        el.style.transform = '';
        el.style.transition = '';
      }
    };
  }, [ref, enabled]);
}
