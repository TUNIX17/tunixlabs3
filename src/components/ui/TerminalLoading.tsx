'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TerminalLine {
  type: 'command' | 'output' | 'success' | 'info';
  text: string;
  delay: number;
}

const TERMINAL_SEQUENCE: TerminalLine[] = [
  { type: 'command', text: 'tunix --init', delay: 0 },
  { type: 'output', text: 'Initializing TunixLabs AI...', delay: 400 },
  { type: 'success', text: '✓ Core systems ready', delay: 800 },
  { type: 'command', text: 'load avatar --model robot', delay: 1200 },
  { type: 'output', text: 'Loading 3D model...', delay: 1600 },
  { type: 'output', text: 'Configuring animations...', delay: 2000 },
  { type: 'success', text: '✓ Avatar loaded', delay: 2400 },
  { type: 'command', text: 'start assistant', delay: 2800 },
  { type: 'info', text: '⚡ Ready to assist', delay: 3200 },
];

// Time before transitioning from logo to terminal
const LOGO_DISPLAY_TIME = 1200;

interface TerminalLoadingProps {
  onComplete?: () => void;
  isModelLoaded?: boolean;
}

type LoadingPhase = 'logo' | 'terminal' | 'fading';

export function TerminalLoading({ onComplete, isModelLoaded = false }: TerminalLoadingProps) {
  const [phase, setPhase] = useState<LoadingPhase>('logo');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Transition from logo to terminal
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('terminal');
    }, LOGO_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, []);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Handle the terminal sequence animation
  useEffect(() => {
    if (phase !== 'terminal' || animationComplete) return;

    const timers: NodeJS.Timeout[] = [];

    TERMINAL_SEQUENCE.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
        if (index === TERMINAL_SEQUENCE.length - 1) {
          setIsTyping(false);
          setAnimationComplete(true);
        }
      }, line.delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [phase, animationComplete]);

  // Handle fade out when both animation is complete AND model is loaded
  useEffect(() => {
    if (animationComplete && isModelLoaded && phase === 'terminal') {
      const fadeTimer = setTimeout(() => {
        setPhase('fading');
      }, 400);
      return () => clearTimeout(fadeTimer);
    }
  }, [animationComplete, isModelLoaded, phase]);

  // Handle completion callback after fade
  useEffect(() => {
    if (phase === 'fading') {
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [phase, onComplete]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return '#1f2937';
      case 'output': return '#6b7280';
      case 'success': return '#059669';
      case 'info': return '#7c3aed';
      default: return '#4b5563';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        transition: 'opacity 0.5s ease',
        opacity: phase === 'fading' ? 0 : 1,
      }}
    >
      {/* Logo Phase */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          transition: 'all 0.6s ease',
          opacity: phase === 'logo' ? 1 : 0,
          transform: phase === 'logo' ? 'scale(1)' : 'scale(0.8)',
          pointerEvents: phase === 'logo' ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            animation: 'logoPulse 1.5s ease-in-out infinite',
          }}
        >
          <Image
            src="/logo_purpura.png"
            alt="TunixLabs"
            width={120}
            height={120}
            priority
            unoptimized
            style={{
              filter: 'drop-shadow(0 4px 20px rgba(124, 58, 237, 0.3))',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#a78bfa',
                animation: 'terminalBounce 0.6s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Terminal Phase */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          margin: '0 16px',
          transition: 'all 0.5s ease',
          opacity: phase === 'terminal' ? 1 : 0,
          transform: phase === 'terminal' ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: phase === 'terminal' ? 'auto' : 'none',
        }}
      >
        {/* Terminal Window - Transparent background with subtle border */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
          }}
        >
          {/* Terminal Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              background: 'rgba(248, 248, 250, 0.9)',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ marginLeft: '10px', fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
              tunix-terminal
            </span>
          </div>

          {/* Terminal Body */}
          <div
            style={{
              padding: '14px',
              fontFamily: "'Fira Code', 'SF Mono', 'Consolas', monospace",
              fontSize: '12px',
              lineHeight: '1.7',
              minHeight: '180px',
            }}
          >
            {TERMINAL_SEQUENCE.slice(0, visibleLines).map((line, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  color: getLineColor(line.type),
                  paddingLeft: line.type !== 'command' ? '14px' : '0',
                  fontWeight: line.type === 'command' || line.type === 'success' || line.type === 'info' ? 600 : 400,
                  animation: 'terminalFadeIn 0.3s ease-out forwards',
                }}
              >
                {line.type === 'command' && (
                  <span style={{ color: '#7c3aed', fontWeight: 700 }}>$</span>
                )}
                <span>{line.text}</span>
              </div>
            ))}

            {/* Typing cursor */}
            {isTyping && phase === 'terminal' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ color: '#7c3aed', fontWeight: 700 }}>$</span>
                <span
                  style={{
                    width: '7px',
                    height: '14px',
                    background: '#7c3aed',
                    opacity: cursorVisible ? 1 : 0,
                    transition: 'opacity 0.1s',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerminalLoading;
