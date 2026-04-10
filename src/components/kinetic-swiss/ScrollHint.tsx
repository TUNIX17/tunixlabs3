'use client';

import styles from './kineticSwiss.module.css';

interface ScrollHintProps {
  visible: boolean;
  label?: string;
}

/**
 * Fixed bottom-center "Scroll" hint with bounce animation.
 * Hidden once the user has scrolled past the hero section.
 */
export function ScrollHint({ visible, label = 'Scroll' }: ScrollHintProps) {
  const className = `${styles.scrollHint}${!visible ? ` ${styles.scrollHintHidden}` : ''}`;

  return (
    <div className={className}>
      {label}
    </div>
  );
}
