'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';
import { TIMING } from './timing';
import styles from './splitFlap.module.css';

interface SplitFlapCounterProps {
  /** Target numeric value to count up to (e.g. 19778) */
  target: number;
  /** Whether the counter should start counting (viewport entered) */
  active: boolean;
  /** Optional suffix text after the number (e.g. "+", "%", "K+") */
  suffix?: string;
  /** Optional prefix text before the number (e.g. "$") */
  prefix?: string;
  /** Format with locale separators (default: true) */
  formatted?: boolean;
  /** CSS className for the container */
  className?: string;
}

/**
 * Parse a display value like "19,778" or "115K+" into { numericPart, suffix }.
 * Used by parent components to extract target number from i18n strings.
 *
 * Handles:
 * - Comma thousands separators: "19,778" -> 19778
 * - Dot thousands separators: "1.056" -> 1056 (only if followed by 3 digits)
 * - Decimal points: "88.7%" -> 88 (integer part only) with suffix ".7%"
 * - Suffixes: "195+" -> 195, suffix "+"
 * - Unit suffixes: "100ms" -> 100, suffix "ms"
 * - Text suffixes: "15 anos" -> 15, suffix " anos"
 */
export function parseMetricValue(raw: string): { target: number; suffix: string; prefix: string } {
  // Remove commas used as thousand separators
  // Remove dots ONLY when followed by exactly 3 digits (thousand separator, not decimal)
  const cleaned = raw.replace(/,/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '');
  // Extract leading non-digit prefix (e.g. "$")
  const prefixMatch = cleaned.match(/^([^0-9]*)/);
  const prefix = prefixMatch?.[1] ?? '';
  // Extract integer numeric part (stop at decimal point or non-digit)
  const restAfterPrefix = cleaned.slice(prefix.length);
  const numMatch = restAfterPrefix.match(/^(\d+)/);
  const target = numMatch ? parseInt(numMatch[1], 10) : 0;
  // Everything after the integer part is suffix (including decimal portion)
  const suffix = numMatch ? restAfterPrefix.slice(numMatch[1].length) : '';
  return { target, suffix, prefix };
}

/**
 * Format a number with locale-appropriate separators.
 * Uses dot for thousands (matching the existing "19,778" pattern in i18n).
 */
function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Easing function: starts slow, accelerates, then decelerates (ease-in-out cubic).
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * SplitFlapCounter -- airport-board style digit counter.
 *
 * Counts up from 0 to target value when `active` becomes true.
 * Each digit gets a brief CSS flip animation (perspective + rotateX)
 * when it changes, staggered from rightmost to leftmost.
 *
 * CSS fallback approach (Rive was assessed and rejected for this use case --
 * variable digit counts + comma formatting + 60 animation states per digit
 * made it impractical vs a clean CSS solution).
 */
export function SplitFlapCounter({
  target,
  active,
  suffix = '',
  prefix = '',
  formatted = true,
  className,
}: SplitFlapCounterProps) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);
  const [flippingDigits, setFlippingDigits] = useState<Set<number>>(new Set());
  const prevDigitsRef = useRef<string>('');
  const hasAnimatedRef = useRef(false);
  const rafRef = useRef<number>(0);

  // Count-up animation via requestAnimationFrame
  const startCountUp = useCallback(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    if (reducedMotion) {
      setDisplayValue(target);
      return;
    }

    const duration = TIMING.SPLIT_FLAP_DURATION_MS;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = Math.round(easedProgress * target);

      setDisplayValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [target, reducedMotion]);

  // Trigger count-up when active
  useEffect(() => {
    if (active && !hasAnimatedRef.current) {
      startCountUp();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, startCountUp]);

  // Track which digits are "flipping" (changed since last render)
  const displayStr = formatted ? formatNumber(displayValue) : String(displayValue);

  useEffect(() => {
    if (reducedMotion) return;

    const prev = prevDigitsRef.current;
    const curr = displayStr;

    if (prev !== curr && prev.length > 0) {
      const newFlipping = new Set<number>();
      // Compare from the right, identifying changed positions
      const maxLen = Math.max(prev.length, curr.length);
      for (let i = 0; i < maxLen; i++) {
        const prevChar = prev[prev.length - 1 - i];
        const currChar = curr[curr.length - 1 - i];
        if (prevChar !== currChar) {
          newFlipping.add(curr.length - 1 - i);
        }
      }
      setFlippingDigits(newFlipping);

      // Clear flip state after the flip animation duration
      const timer = setTimeout(() => {
        setFlippingDigits(new Set());
      }, TIMING.SPLIT_FLAP_FLIP_MS);

      return () => clearTimeout(timer);
    }

    prevDigitsRef.current = curr;
  }, [displayStr, reducedMotion]);

  // Always update prevDigitsRef
  useEffect(() => {
    prevDigitsRef.current = displayStr;
  });

  const containerClass = `${styles.counter}${className ? ` ${className}` : ''}`;

  return (
    <span className={containerClass} aria-label={`${prefix}${formatted ? formatNumber(target) : target}${suffix}`}>
      {prefix && <span className={styles.affix}>{prefix}</span>}
      {displayStr.split('').map((char, i) => {
        const isDigit = /\d/.test(char);
        const isFlipping = flippingDigits.has(i);

        if (!isDigit) {
          // Separator (comma, dot, space)
          return (
            <span key={`sep-${i}`} className={styles.separator}>
              {char}
            </span>
          );
        }

        return (
          <span
            key={`digit-${i}`}
            className={`${styles.digitSlot}${isFlipping ? ` ${styles.flipping}` : ''}`}
            style={{
              animationDelay: isFlipping
                ? `${(displayStr.length - 1 - i) * TIMING.SPLIT_FLAP_DIGIT_STAGGER_MS}ms`
                : undefined,
            }}
          >
            <span className={styles.digitInner}>{char}</span>
          </span>
        );
      })}
      {suffix && <span className={styles.affix}>{suffix}</span>}
    </span>
  );
}
