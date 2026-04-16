'use client';

import { useCallback, useEffect } from 'react';
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from '@rive-app/react-canvas';

interface HeroRiveProps {
  onLoad?: () => void;
  className?: string;
}

const STATE_MACHINE = 'Monitor';
const SCROLL_INPUT = 'scrollProgress';
const HOVER_INPUT = 'hoverIndex';

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export default function HeroRive({ onLoad, className }: HeroRiveProps) {
  const handleLoad = useCallback(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  const { rive, RiveComponent } = useRive({
    src: '/rive/hero-monitor.riv',
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: handleLoad,
  });

  const scrollInput = useStateMachineInput(rive, STATE_MACHINE, SCROLL_INPUT);
  const hoverInput = useStateMachineInput(rive, STATE_MACHINE, HOVER_INPUT);

  useEffect(() => {
    if (!scrollInput) return;

    let ticking = false;

    const update = (): void => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      scrollInput.value = progress;
      ticking = false;
    };

    const handleScroll = (): void => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollInput]);

  useEffect(() => {
    return () => {
      rive?.cleanup?.();
    };
  }, [rive]);

  const handleEnter = useCallback(
    (idx: number) => {
      if (hoverInput) hoverInput.value = idx;
    },
    [hoverInput],
  );

  const handleLeave = useCallback(() => {
    if (hoverInput) hoverInput.value = -1;
  }, [hoverInput]);

  const containerClass = `relative w-full max-w-[520px] aspect-[16/10] mx-auto ${className ?? ''}`.trim();

  return (
    <div className={containerClass}>
      <RiveComponent className="w-full h-full" />
      <div
        className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none"
        aria-hidden="true"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="pointer-events-auto"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            onFocus={() => handleEnter(i)}
            onBlur={handleLeave}
          />
        ))}
      </div>
    </div>
  );
}
