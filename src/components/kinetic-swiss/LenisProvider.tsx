'use client';

import { useEffect, type ReactNode } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Initializes Lenis smooth scrolling on mount.
 * Skips initialization entirely when the user prefers reduced motion.
 * Cleans up the Lenis instance on unmount.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let raf: number;
    let lenis: InstanceType<typeof import('lenis').default> | undefined;

    // Dynamic import so SSR never touches browser-only code
    import('lenis').then((mod) => {
      const Lenis = mod.default;
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });

      function tick(time: number) {
        lenis?.raf(time);
        raf = requestAnimationFrame(tick);
      }

      raf = requestAnimationFrame(tick);
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
