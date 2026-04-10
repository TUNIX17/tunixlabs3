'use client';

import { type ReactNode } from 'react';
import styles from './kineticSwiss.module.css';

interface TerminalTopBar {
  path: string;
  meta: string;
  prodActive: boolean;
}

interface TerminalProps {
  isShifted: boolean;
  topBar: TerminalTopBar;
  prompt: string;
  promptTyping: boolean;
  children: ReactNode;
}

/**
 * The main persistent terminal — fixed center, macOS-style top bar,
 * traffic lights, prompt line, and content area.
 * Width/height animated via CSS transition (TIMING constants in module CSS).
 * When isShifted, shrinks to make room for the aside terminal.
 */
export function Terminal({
  isShifted,
  topBar,
  prompt,
  promptTyping,
  children,
}: TerminalProps) {
  const terminalClass = `${styles.terminal}${
    isShifted ? ` ${styles.terminalShifted}` : ''
  }`;

  const promptClass = `${styles.ttyPrompt}${
    promptTyping ? ` ${styles.ttyPromptTyping}` : ''
  }`;

  return (
    <div className={terminalClass}>
      {/* Top bar */}
      <div className={styles.ttyTopbar}>
        {/* Traffic lights */}
        <div className={styles.lights}>
          <span
            className={`${styles.light} ${styles.lightClose}`}
            data-label="local"
          />
          <span
            className={`${styles.light} ${styles.lightLive}`}
            data-label="live"
          />
          <span
            className={`${styles.light} ${styles.lightProd}${
              topBar.prodActive ? ` ${styles.lightProdActive}` : ''
            }`}
            data-label="prod"
          />
        </div>

        {/* Path */}
        <div className={styles.ttyPath}>
          tunixlabs <span className={styles.slash}>&middot;</span> ~/<strong>{topBar.path}</strong>
        </div>

        {/* Meta */}
        <div className={styles.ttyMeta}>{topBar.meta}</div>
      </div>

      {/* Body */}
      <div className={styles.ttyBody}>
        {/* Prompt line */}
        <div className={promptClass}>
          <span className={styles.dollar}>$</span>
          <span className={styles.cmdText}>{prompt}</span>
          <span className={styles.cursor} />
        </div>

        {/* Content area — states injected as children */}
        <div className={styles.ttyContent}>{children}</div>
      </div>
    </div>
  );
}
