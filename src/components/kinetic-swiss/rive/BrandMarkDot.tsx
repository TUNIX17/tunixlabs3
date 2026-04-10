'use client';

import { useEffect, useState } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface BrandMarkDotProps {
  /** Scroll progress 0-1, drives the state machine */
  scrollProgress: number;
  /** CSS className for the Rive container */
  className?: string;
  /** CSS className for the static CSS fallback dot */
  fallbackClassName?: string;
}

/**
 * Rive-powered brand mark dot that reacts to scroll position.
 * Three states: idle (slow pulse), scrolling (fast pulse), bottom (solid).
 * Falls back to null on load error — the parent handles CSS fallback.
 */
export function BrandMarkDot({ scrollProgress, className, fallbackClassName }: BrandMarkDotProps) {
  const [hasError, setHasError] = useState(false);

  const { rive, RiveComponent } = useRive(
    {
      src: '/design-explorations/rive/brand-mark.riv',
      artboard: 'Main',
      stateMachines: ['brandmark'],
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
      onLoadError: () => setHasError(true),
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  const scrollInput = useStateMachineInput(rive, 'brandmark', 'scrollProgress');

  useEffect(() => {
    if (scrollInput) {
      scrollInput.value = scrollProgress;
    }
  }, [scrollInput, scrollProgress]);

  if (hasError) {
    return <span className={fallbackClassName} />;
  }

  return (
    <span className={className} style={{ display: 'inline-block', width: '12px', height: '12px', verticalAlign: 'middle' }}>
      <RiveComponent />
    </span>
  );
}
