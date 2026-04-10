'use client';

import { useState, type ReactNode } from 'react';
import { RiveAnimation } from './RiveAnimation';

interface RiveWithFallbackProps {
  /** URL or path to the .riv file */
  src: string;
  /** State machine name to activate (optional) */
  stateMachine?: string;
  /** CSS className for the container */
  className?: string;
  /** Whether to autoplay (default: true) */
  autoplay?: boolean;
  /** Artboard name (optional) */
  artboard?: string;
  /** Fallback content shown if Rive fails to load */
  fallback: ReactNode;
}

export function RiveWithFallback({
  src,
  stateMachine,
  className,
  autoplay = true,
  artboard,
  fallback,
}: RiveWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Show fallback while loading, hidden once Rive is ready */}
      {!isLoaded && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {fallback}
        </div>
      )}
      <RiveAnimation
        src={src}
        stateMachine={stateMachine}
        autoplay={autoplay}
        artboard={artboard}
        onLoadError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
