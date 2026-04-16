'use client';

import { useRef, useEffect, useState, forwardRef, type ReactNode, type ForwardedRef } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { TypingEngine, type TypingEngineHandle } from './TypingEngine';
import styles from './kineticSwiss.module.css';

interface TerminalTopBar {
  path: string;
  meta: string;
  prodActive: boolean;
}

export interface TerminalHandle {
  /** Access the prompt TypingEngine for backspace/streamLines. */
  promptEngine: TypingEngineHandle | null;
}

interface TerminalProps {
  isShifted: boolean;
  topBar: TerminalTopBar;
  prompt: string;
  promptTyping: boolean;
  children: ReactNode;
  /**
   * Traffic light state: 0=booting, 1=running (default), 2=error, 3=deployed.
   * Drives the Rive state machine "lights" via its "stateInput" number input.
   */
  trafficState?: number;
  /**
   * Cursor shape state: 0=idle (solid block), 1=typing (blinking block),
   * 2=waiting (thin pipe), 3=hover (down arrow).
   * Drives the Rive state machine "cursor" via its "stateInput" number input.
   */
  cursorState?: number;
}

/**
 * The main persistent terminal — fixed center, macOS-style top bar,
 * traffic lights, prompt line, and content area.
 * Width/height animated via CSS transition (TIMING constants in module CSS).
 * When isShifted, shrinks to make room for the aside terminal.
 *
 * The prompt line uses TypingEngine to animate the text character-by-character.
 * Exposes a TerminalHandle ref so the orchestrator can call backspace/streamLines.
 */
/**
 * Rive-powered traffic lights with CSS fallback.
 * Drives the "stateInput" number input: 0=booting, 1=running, 2=error, 3=deployed.
 */
function TrafficLights({ state, prodActive }: { state: number; prodActive: boolean }) {
  const [riveFailed, setRiveFailed] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: '/design-explorations/rive/traffic-lights.riv',
    artboard: 'Main',
    stateMachines: ['lights'],
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setRiveFailed(true),
  });

  const stateInput = useStateMachineInput(rive, 'lights', 'stateInput');

  useEffect(() => {
    if (stateInput) {
      stateInput.value = state;
    }
  }, [stateInput, state]);

  if (riveFailed) {
    return (
      <div className={styles.lights}>
        <span className={`${styles.light} ${styles.lightClose}`} data-label="local" />
        <span className={`${styles.light} ${styles.lightLive}`} data-label="live" />
        <span
          className={`${styles.light} ${styles.lightProd}${prodActive ? ` ${styles.lightProdActive}` : ''}`}
          data-label="prod"
        />
      </div>
    );
  }

  return (
    <div className={styles.lights} style={{ width: 80, height: 20 }}>
      <RiveComponent />
    </div>
  );
}

/**
 * Rive-powered cursor with CSS fallback.
 * Drives "stateInput": 0=idle (block), 1=typing (blink), 2=waiting (pipe), 3=hover (arrow).
 */
function RiveCursor({ state }: { state: number }) {
  const [riveFailed, setRiveFailed] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: '/design-explorations/rive/cursor-shape.riv',
    artboard: 'Main',
    stateMachines: ['cursor'],
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setRiveFailed(true),
  });

  const stateInput = useStateMachineInput(rive, 'cursor', 'stateInput');

  useEffect(() => {
    if (stateInput) {
      stateInput.value = state;
    }
  }, [stateInput, state]);

  if (riveFailed) {
    return <span className={styles.cursor} />;
  }

  return (
    <span className={styles.cursor} style={{ background: 'none', animation: 'none' }}>
      <RiveComponent />
    </span>
  );
}

export const Terminal = forwardRef(function Terminal(
  { isShifted, topBar, prompt, promptTyping, children, trafficState = 1, cursorState = 0 }: TerminalProps,
  ref: ForwardedRef<TerminalHandle>
) {
  const engineRef = useRef<TypingEngineHandle>(null);

  // Forward the prompt engine to the parent via the Terminal ref
  const terminalHandleRef = useRef<TerminalHandle>({ promptEngine: null });
  terminalHandleRef.current.promptEngine = engineRef.current;

  // Use a callback ref pattern to keep the forwarded ref in sync
  if (typeof ref === 'function') {
    ref(terminalHandleRef.current);
  } else if (ref) {
    ref.current = terminalHandleRef.current;
  }

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
        {/* Traffic lights — Rive with CSS fallback */}
        <TrafficLights state={trafficState} prodActive={topBar.prodActive} />

        {/* Path */}
        <div className={styles.ttyPath}>
          tunixlabs <span className={styles.slash}>&middot;</span> ~/<strong>{topBar.path}</strong>
        </div>

        {/* Meta */}
        <div className={styles.ttyMeta}>{topBar.meta}</div>
      </div>

      {/* Body */}
      <div className={styles.ttyBody}>
        {/* Prompt line — TypingEngine drives character-by-character typing */}
        <div className={promptClass}>
          <span className={styles.dollar}>$</span>
          <span className={styles.cmdText}>
            <TypingEngine ref={engineRef} text={prompt} />
          </span>
          <RiveCursor state={cursorState} />
        </div>

        {/* Content area — states injected as children */}
        <div className={styles.ttyContent}>{children}</div>
      </div>
    </div>
  );
});
