'use client';

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type ForwardedRef,
} from 'react';
import { TIMING } from './timing';
import { useReducedMotion } from './hooks/useReducedMotion';

export interface TypingEngineHandle {
  /** Remove characters one-by-one at backspace speed, then resolve. */
  backspace: () => Promise<void>;
}

interface TypingEngineProps {
  text: string;
  onComplete?: () => void;
  delayMs?: number;
}

/**
 * Progressively renders characters into a <span> ref, simulating terminal typing.
 * Respects prefers-reduced-motion by showing the full text instantly.
 * Exposes a `backspace` method via useImperativeHandle.
 */
export const TypingEngine = forwardRef(function TypingEngine(
  { text, onComplete, delayMs = TIMING.CHAR_DELAY_MS }: TypingEngineProps,
  ref: ForwardedRef<TypingEngineHandle>
) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedMotion = useReducedMotion();

  // Cleanup all pending timeouts
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useImperativeHandle(
    ref,
    () => ({
      backspace: () =>
        new Promise<void>((resolve) => {
          clearTimers();
          const el = spanRef.current;
          if (!el) {
            resolve();
            return;
          }

          if (reducedMotion) {
            el.textContent = '';
            resolve();
            return;
          }

          const step = () => {
            if (!el) {
              resolve();
              return;
            }
            const current = el.textContent ?? '';
            if (current.length > 0) {
              el.textContent = current.slice(0, -1);
              const timer = setTimeout(step, TIMING.BACKSPACE_DELAY_MS);
              timersRef.current.push(timer);
            } else {
              resolve();
            }
          };
          step();
        }),
    }),
    [reducedMotion]
  );

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    clearTimers();
    el.textContent = '';

    if (reducedMotion) {
      el.textContent = text;
      onComplete?.();
      return;
    }

    let i = 0;
    const step = () => {
      if (i < text.length) {
        el.textContent = (el.textContent ?? '') + text[i];
        i++;
        const timer = setTimeout(step, delayMs);
        timersRef.current.push(timer);
      } else {
        onComplete?.();
      }
    };
    step();

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delayMs, reducedMotion]);

  return <span ref={spanRef} />;
});
