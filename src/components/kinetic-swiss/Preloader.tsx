'use client';

import { useState, useEffect } from 'react';
import { TIMING } from './timing';
import { RiveWithFallback } from './rive/RiveWithFallback';
import styles from './kineticSwiss.module.css';

/**
 * Full-screen preloader overlay with a pulsing dot.
 * Auto-dismisses after fonts + a short delay, then fades out.
 * Uses Rive animation (preloader-dot.riv) with CSS fallback.
 */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Wait for fonts, then dismiss after a brief pause
    const dismiss = () => {
      // Small delay so the pulse is visible
      setTimeout(() => setDone(true), TIMING.PRELOAD_DISMISS_DELAY_MS);
    };

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(dismiss);
    } else {
      dismiss();
    }
  }, []);

  const className = `${styles.preloader}${done ? ` ${styles.preloaderDone}` : ''}`;

  return (
    <div className={className}>
      <RiveWithFallback
        src="/design-explorations/rive/preloader-dot.riv"
        stateMachine="State Machine 1"
        className={styles.preloaderDot}
        fallback={<div className={styles.preloaderDot} />}
      />
    </div>
  );
}
