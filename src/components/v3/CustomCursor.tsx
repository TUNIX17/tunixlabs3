'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Awwwards-style custom cursor: small dot + trailing ring.
 * - Dot follows mouse instantly (lerp 0.35)
 * - Ring follows with lag (lerp 0.12)
 * - Ring expands + changes color on interactive element hover
 * - Hides on touch devices and when prefers-reduced-motion
 * - Falls back to native cursor on mobile/touch
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return;
    // Skip if prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setVisible(true);
    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="grow"]');
      if (interactive) setHovering(true);
    };

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="grow"]');
      if (interactive) setHovering(false);
    };

    const onOut = () => {
      mouse.current = { x: -100, y: -100 };
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });
    document.addEventListener('mouseleave', onOut);

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.35);
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.35);
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('mouseleave', onOut);
    };
  }, [hovering]);

  if (!visible) return null;

  return (
    <>
      {/* Dot — sharp, instant response */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6, borderRadius: '50%',
          background: '#ccff00',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: hovering ? 'width 0.3s, height 0.3s, background 0.3s' : 'none',
          ...(hovering ? { width: 4, height: 4, background: '#fff' } : {}),
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring — trailing, expands on hover */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32, borderRadius: '50%',
          border: `1.5px solid ${hovering ? '#ccff00' : 'rgba(204,255,0,0.4)'}`,
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'border-color 0.3s, opacity 0.3s',
          opacity: hovering ? 1 : 0.6,
        }}
      />
    </>
  );
}
