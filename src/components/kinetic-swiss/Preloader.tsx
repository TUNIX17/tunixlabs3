'use client';

import { useState, useEffect } from 'react';
import { TIMING } from './timing';
import styles from './kineticSwiss.module.css';

/**
 * Terminal boot preloader — dark screen with cursor blink + typing,
 * then fades to reveal the terminal. Pure CSS, no Rive dependency.
 * The Rive logo splash (logo-splash.riv) is loaded separately if available.
 */
export function Preloader() {
  const [phase, setPhase] = useState<'boot' | 'typing' | 'done'>('boot');

  useEffect(() => {
    // Phase 1: cursor blinks on dark screen (600ms)
    const t1 = setTimeout(() => setPhase('typing'), 600);
    // Phase 2: "initializing..." types out (800ms)
    const t2 = setTimeout(() => {
      // Wait for fonts before dismissing
      const dismiss = () => setPhase('done');
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(dismiss);
      } else {
        dismiss();
      }
    }, 600 + 800 + TIMING.PRELOAD_DISMISS_DELAY_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const rootClass = `${styles.preloader} ${styles.preloaderBoot}${
    phase === 'done' ? ` ${styles.preloaderDone}` : ''
  }`;

  return (
    <div className={rootClass}>
      <div className={styles.bootTerminal}>
        <div className={styles.bootLine}>
          <span className={styles.bootPrompt}>{'>'}</span>
          <span className={styles.bootCursor} />
        </div>
        {(phase === 'typing' || phase === 'done') && (
          <div className={`${styles.bootLine} ${styles.bootLineTyping}`}>
            <span className={styles.bootPrompt}>{'>'}</span>
            <span className={styles.bootText}>initializing system...</span>
          </div>
        )}
      </div>
    </div>
  );
}
