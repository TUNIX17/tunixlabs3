'use client';

import { useState, useEffect } from 'react';
import styles from './kineticSwiss.module.css';

/**
 * Full-screen preloader overlay with a pulsing dot.
 * Auto-dismisses after fonts + a short delay, then fades out.
 */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Wait for fonts, then dismiss after a brief pause
    const dismiss = () => {
      // Small delay so the pulse is visible
      setTimeout(() => setDone(true), 400);
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
      <div className={styles.preloaderDot} />
    </div>
  );
}
