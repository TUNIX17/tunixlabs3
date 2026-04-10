'use client';

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  type ForwardedRef,
} from 'react';
import { TIMING } from './timing';
import { useReducedMotion } from './hooks/useReducedMotion';

export interface StreamLinesOptions {
  charDelay?: number;
  lineDelay?: number;
}

export interface TypingEngineHandle {
  /** Remove characters one-by-one at backspace speed, then resolve. */
  backspace: () => Promise<void>;
  /**
   * Type out an array of lines character-by-character with pauses between lines.
   * Returns an object with a promise and a cancel function.
   * onLine fires each time a line finishes (index, full line text).
   */
  streamLines: (
    lines: string[],
    opts?: StreamLinesOptions,
    onLine?: (index: number, line: string) => void
  ) => { promise: Promise<void>; cancel: () => void };
}

interface TypingEngineProps {
  text: string;
  onComplete?: () => void;
  delayMs?: number;
}

/**
 * Progressively renders characters into a <span> ref, simulating terminal typing.
 * Respects prefers-reduced-motion by showing the full text instantly.
 * Exposes `backspace` and `streamLines` methods via useImperativeHandle.
 */
export const TypingEngine = forwardRef(function TypingEngine(
  { text, onComplete, delayMs = TIMING.CHAR_DELAY_MS }: TypingEngineProps,
  ref: ForwardedRef<TypingEngineHandle>
) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelledRef = useRef(false);
  const reducedMotion = useReducedMotion();

  // Cleanup all pending timeouts
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

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

      streamLines: (
        lines: string[],
        opts?: StreamLinesOptions,
        onLine?: (index: number, line: string) => void
      ) => {
        const charDelay = opts?.charDelay ?? TIMING.CHAR_DELAY_MS;
        const lineDelay = opts?.lineDelay ?? TIMING.LINE_STAGGER_MS;

        cancelledRef.current = false;

        const cancel = () => {
          cancelledRef.current = true;
          clearTimers();
        };

        const promise = new Promise<void>((resolve) => {
          if (reducedMotion) {
            // Instantly reveal all lines
            for (let i = 0; i < lines.length; i++) {
              onLine?.(i, lines[i]);
            }
            resolve();
            return;
          }

          let lineIdx = 0;

          const typeLine = () => {
            if (cancelledRef.current || lineIdx >= lines.length) {
              resolve();
              return;
            }

            const line = lines[lineIdx];
            const currentLineIdx = lineIdx;
            let charIdx = 0;

            const typeChar = () => {
              if (cancelledRef.current) {
                resolve();
                return;
              }

              if (charIdx < line.length) {
                charIdx++;
                // Notify partial progress — the hook tracks char-level streaming
                // but we only notify on line completion to keep state manageable
                const timer = setTimeout(typeChar, charDelay);
                timersRef.current.push(timer);
              } else {
                // Line finished
                onLine?.(currentLineIdx, line);
                lineIdx++;

                if (lineIdx < lines.length) {
                  const timer = setTimeout(typeLine, lineDelay);
                  timersRef.current.push(timer);
                } else {
                  resolve();
                }
              }
            };

            typeChar();
          };

          typeLine();
        });

        return { promise, cancel };
      },
    }),
    [reducedMotion, clearTimers]
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
