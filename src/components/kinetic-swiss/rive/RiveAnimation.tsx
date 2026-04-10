'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useCallback, useRef } from 'react';

interface RiveAnimationProps {
  /** URL or path to the .riv file */
  src: string;
  /** State machine name to activate (optional) */
  stateMachine?: string;
  /** CSS className for the container div */
  className?: string;
  /** Whether to autoplay on load (default: true) */
  autoplay?: boolean;
  /** Artboard name (optional, defaults to first) */
  artboard?: string;
  /** Callback fired when Rive load fails */
  onLoadError?: (error: unknown) => void;
  /** Callback fired when Rive loads successfully */
  onLoad?: () => void;
}

export function RiveAnimation({
  src,
  stateMachine,
  className,
  autoplay = true,
  artboard,
  onLoadError,
  onLoad,
}: RiveAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { RiveComponent, rive } = useRive(
    {
      src,
      artboard,
      stateMachines: stateMachine ? [stateMachine] : undefined,
      autoplay,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
      onLoad: () => {
        onLoad?.();
      },
      onLoadError: (e) => {
        onLoadError?.(e);
      },
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    []
  );

  return (
    <div ref={setRef} className={className} style={{ width: '100%', height: '100%' }}>
      <RiveComponent />
    </div>
  );
}
