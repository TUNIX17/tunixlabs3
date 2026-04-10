'use client';

import styles from './kineticSwiss.module.css';

interface ScrollProgressProps {
  progress: number; // 0–100
}

/**
 * Fixed left-edge vertical progress bar.
 * Height of the fill represents overall page scroll progress.
 */
export function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <div className={styles.scrollProgress}>
      <div
        className={styles.scrollProgressFill}
        style={{ '--progress': `${progress}%` } as React.CSSProperties}
      />
    </div>
  );
}
