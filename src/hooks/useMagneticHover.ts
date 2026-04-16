'use client';

import { useRef, useEffect, type RefObject } from 'react';

/**
 * Makes an element magnetically attract toward the cursor when nearby.
 * Used on CTA buttons for premium Awwwards-style interaction feel.
 *
 * @param strength - Max pixel displacement (default 8)
 * @param radius - Activation radius in pixels (default 120)
 */
export function useMagneticHover<T extends HTMLElement>(
  strength = 8,
  radius = 120,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength;
        const tx = (dx / dist) * pull;
        const ty = (dy / dist) * pull;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      } else {
        el.style.transform = '';
      }
    };

    const onLeave = () => {
      el.style.transform = '';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.style.transform = '';
    };
  }, [strength, radius]);

  return ref;
}
