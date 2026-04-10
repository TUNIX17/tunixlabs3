'use client';

import { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import styles from './kineticSwiss.module.css';

/**
 * Logo splash preloader — Rive dripping-T pulses + flies to nav corner.
 * Falls back to CSS terminal boot if Rive fails.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [riveFailed, setRiveFailed] = useState(false);
  const [cssPhase, setCssPhase] = useState<'boot' | 'typing' | 'done'>('boot');

  const { RiveComponent } = useRive({
    src: '/design-explorations/rive/logo-splash.riv',
    artboard: 'Splash',
    stateMachines: ['splash'],
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    onLoadError: () => setRiveFailed(true),
    onLoad: () => {
      setTimeout(() => setDone(true), 1800);
    },
  });

  // CSS fallback timing
  useEffect(() => {
    if (!riveFailed) return;
    const t1 = setTimeout(() => setCssPhase('typing'), 600);
    const t2 = setTimeout(() => {
      setCssPhase('done');
      setDone(true);
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [riveFailed]);

  return (
    <div className={`${styles.preloader}${done ? ` ${styles.preloaderDone}` : ''}`}>
      {!riveFailed ? (
        <div className={styles.preloaderRive}>
          <RiveComponent />
        </div>
      ) : (
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
