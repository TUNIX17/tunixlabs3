'use client';

import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — attach to a root container to progressively reveal any
 * descendant carrying the `.reveal` class as it enters the viewport. When
 * the user has `prefers-reduced-motion: reduce`, the hook does nothing (the
 * CSS rule in `animations.css` already forces `.reveal` to stay visible in
 * that case).
 *
 * Why a hook and not framer-motion
 * ---------------------------------
 * Framer-motion is ~40KB gzip and overkill for fade-up reveals. The native
 * IntersectionObserver API is supported everywhere we target and adds zero
 * bundle weight. The trigger-once semantics are the right default (we do not
 * re-hide elements when they scroll back offscreen).
 *
 * Usage
 * -----
 * const ref = useScrollReveal<HTMLDivElement>();
 * return <div ref={ref}>...<article className="reveal">...</article>...</div>;
 *
 * Each `.reveal` can have `data-reveal-delay="1"`..."4" for staggered entry.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === 'undefined') return;

    // If the user prefers reduced motion, do not register the observer. The
    // CSS fallback in animations.css keeps the content visible.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const all = root.querySelectorAll<HTMLElement>('.reveal');
      all.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Trigger a bit before the element reaches the viewport so the motion
        // feels timely rather than delayed.
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05,
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}
