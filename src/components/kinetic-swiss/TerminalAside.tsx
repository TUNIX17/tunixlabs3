'use client';

import styles from './kineticSwiss.module.css';

interface TerminalAsideProps {
  visible: boolean;
  caption?: string;
  captionStrong?: string;
}

/**
 * Dark mini-terminal that appears to the left of the main terminal
 * during the About state. Contains a portrait placeholder + caption.
 * Hidden on mobile (CSS handles display:none at <= 768px).
 */
export function TerminalAside({
  visible,
  caption = 'Alejandro Moyano Foncea',
  captionStrong = 'Founder & sole operator',
}: TerminalAsideProps) {
  const className = `${styles.terminalAside}${
    visible ? ` ${styles.terminalAsideVisible}` : ''
  }`;

  return (
    <div className={className}>
      {/* Mini top bar */}
      <div className={styles.ttyTopbarMini}>
        <div className={styles.lights}>
          <span className={`${styles.light} ${styles.lightClose}`} />
          <span className={`${styles.light} ${styles.lightProd}`} />
        </div>
        <div className={styles.ttyPathMini}>
          tunixlabs <strong>team</strong>
        </div>
      </div>

      {/* Body: portrait placeholder */}
      <div className={styles.ttyAsideBody}>
        <div className={styles.asidePortrait} />
        <div className={styles.asideCaption}>
          <strong>{captionStrong}</strong>
          <br />
          {caption}
        </div>
      </div>
    </div>
  );
}
