'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface ScrollTrigger {
  id: string;
  path: string;
  prompts: string[];
  meta: string;
}

export interface ScrollDriverState {
  activeId: string;
  scrollProgress: number;
}

/**
 * Listens to window scroll, detects which trigger section contains the
 * viewport center, and returns the active trigger id + overall scroll progress.
 *
 * Trigger elements are expected to be rendered as `<div data-trigger-id="{id}">`
 * inside the scroll-driver container. This hook queries the DOM for them.
 *
 * Uses rAF throttling per the v2 prototype reference.
 */
export function useScrollDriver(
  triggers: ScrollTrigger[],
  containerRef: React.RefObject<HTMLElement | null>
): ScrollDriverState {
  const [state, setState] = useState<ScrollDriverState>({
    activeId: triggers[0]?.id ?? '',
    scrollProgress: 0,
  });

  const tickingRef = useRef(false);

  const update = useCallback(() => {
    const container = containerRef.current;
    if (!container || triggers.length === 0) return;

    const viewportCenter = window.scrollY + window.innerHeight / 2;
    const triggerEls = container.querySelectorAll<HTMLElement>('[data-trigger-id]');

    let foundId = triggers[0].id;

    for (let i = 0; i < triggerEls.length; i++) {
      const el = triggerEls[i];
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const bottom = top + rect.height;

      if (viewportCenter >= top && viewportCenter <= bottom) {
        foundId = el.dataset.triggerId ?? foundId;
        break;
      }
    }

    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;

    setState((prev) => {
      if (prev.activeId === foundId && Math.abs(prev.scrollProgress - progress) < 0.5) {
        return prev;
      }
      return { activeId: foundId, scrollProgress: progress };
    });
  }, [triggers, containerRef]);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        update();
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [update]);

  return state;
}
