'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';
import type { TypingEngineHandle } from '../TypingEngine';

export interface ContentStreamState {
  /** Lines that have been fully revealed so far (grows as streaming proceeds). */
  streamedLines: string[];
  /** Whether content is currently being streamed. */
  isStreaming: boolean;
  /** Index of the line currently being typed (or -1 if idle). */
  currentLineIndex: number;
}

interface UseContentStreamOptions {
  /** All content lines for the active state. */
  lines: string[];
  /** The active state ID — streaming restarts when this changes. */
  activeStateId: string;
  /** Ref to the TypingEngine imperative handle. */
  engineRef: React.RefObject<TypingEngineHandle | null>;
  /** Whether this state is actually active. */
  active: boolean;
}

/**
 * Drives character-by-character line streaming for terminal content.
 * When activeStateId changes:
 *   1. Cancels any in-flight stream
 *   2. Resets streamedLines to []
 *   3. Calls engineRef.streamLines(lines) to begin typing
 *   4. Progressively adds each line as it completes
 *
 * Respects prefers-reduced-motion: instantly reveals all lines.
 */
export function useContentStream({
  lines,
  activeStateId,
  engineRef,
  active,
}: UseContentStreamOptions): ContentStreamState {
  const [streamedLines, setStreamedLines] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const cancelRef = useRef<(() => void) | null>(null);
  const prevStateRef = useRef<string>('');
  const reducedMotion = useReducedMotion();

  // Stable line list reference to avoid triggering the effect on every render
  // when the parent reconstructs the array
  const stableLines = useMemo(() => lines, [JSON.stringify(lines)]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelStream = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  useEffect(() => {
    // If not active, reset and bail
    if (!active) {
      cancelStream();
      setStreamedLines([]);
      setIsStreaming(false);
      setCurrentLineIndex(-1);
      prevStateRef.current = '';
      return;
    }

    // If state hasn't changed, don't re-trigger
    if (prevStateRef.current === activeStateId) {
      return;
    }
    prevStateRef.current = activeStateId;

    // Cancel previous stream
    cancelStream();

    // Start fresh
    setStreamedLines([]);
    setCurrentLineIndex(-1);

    if (stableLines.length === 0) {
      setIsStreaming(false);
      return;
    }

    // Reduced motion: reveal all immediately
    if (reducedMotion) {
      setStreamedLines([...stableLines]);
      setCurrentLineIndex(stableLines.length - 1);
      setIsStreaming(false);
      return;
    }

    const engine = engineRef.current;
    if (!engine) {
      // No engine available — fallback to instant reveal
      setStreamedLines([...stableLines]);
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);

    const { promise, cancel } = engine.streamLines(
      stableLines,
      undefined,
      (index: number, line: string) => {
        setStreamedLines((prev) => {
          const next = [...prev];
          next[index] = line;
          return next;
        });
        setCurrentLineIndex(index);
      }
    );

    cancelRef.current = cancel;

    promise.then(() => {
      setIsStreaming(false);
      cancelRef.current = null;
    });

    return () => {
      cancelStream();
    };
  }, [active, activeStateId, stableLines, engineRef, reducedMotion, cancelStream]);

  return { streamedLines, isStreaming, currentLineIndex };
}
