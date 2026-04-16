'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import styles from './kineticSwiss.module.css';

/**
 * Logo splash preloader — Rive animation of the Tunixlabs dripping-T logo:
 *   1. Logo appears centered on dark background
 *   2. Pulses 2x with spring bounce
 *   3. Shrinks and flies to top-left corner (nav position)
 *   4. Background fades from dark to transparent
 *   5. Preloader dismisses, revealing the terminal
 *
 * Falls back to CSS terminal boot if Rive fails to load.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [riveFailed, setRiveFailed] = useState(false);
  const [cssPhase, setCssPhase] = useState<'boot' | 'typing' | 'done'>('boot');

  // Rive logo splash animation
  const { RiveComponent } = useRive({
    src: '/design-explorations/rive/logo-splash.riv',
    artboard: 'Splash',
    stateMachines: ['splash'],
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    onLoadError: () => setRiveFailed(true),
    onLoad: () => {
      // Dismiss after animation duration (1.5s) + small buffer
      setTimeout(() => setDone(true), 1800);
    },
  });

  // CSS fallback timing
  useEffect(() => {
    if (!riveFailed) return;
    const t1 = setTimeout(() => setCssPhase('typing'), 600);
    const t2 = setTimeout(() => {
      const dismiss = () => { setCssPhase('done'); setDone(true); };
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(dismiss);
      } else {
        dismiss();
      }
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [riveFailed]);

  const rootClass = `${styles.preloader}${riveFailed ? ` ${styles.preloaderBoot}` : ''}${
    done ? ` ${styles.preloaderDone}` : ''
  }`;

  return (
    <div className={rootClass}>
      {!riveFailed ? (
        /* Rive logo splash — full viewport */
        <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }}>
          <RiveComponent />
        </div>
      ) : (
        /* CSS fallback — terminal boot */
        <div className={styles.bootTerminal}>
          <div className={styles.bootLine}>
            <span className={styles.bootPrompt}>{'>'}</span>
            <span className={styles.bootCursor} />
          </div>
          {(cssPhase === 'typing' || cssPhase === 'done') && (
            <div className={`${styles.bootLine} ${styles.bootLineTyping}`}>
              <span className={styles.bootPrompt}>{'>'}</span>
              <span className={styles.bootText}>initializing system...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
