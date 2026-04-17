'use client';

/**
 * Terminal-style chat modal rendered globally via TerminalChatProvider.
 * Uses Chatwoot Public Client API + ActionCable under the hood so Alejandro
 * replies from the normal Chatwoot dashboard and the user sees the bubble
 * appear in real time inside this themed UI.
 */
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { trackEvent, Events } from '@/lib/analytics/track';
import { useTerminalChat } from './TerminalChatProvider';
import { useChatwootChat } from './useChatwootChat';

export function TerminalChat() {
  const { isOpen, close } = useTerminalChat();
  const t = useTranslations('TerminalChat');
  const { messages, isConnected, isAgentTyping, isBootstrapping, error, sendMessage } =
    useChatwootChat(isOpen);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      trackEvent(Events.CHAT_TERMINAL_OPEN);
      // Focus input after modal mount animation
      const id = window.setTimeout(() => inputRef.current?.focus(), 250);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAgentTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    trackEvent(Events.CHAT_TERMINAL_MESSAGE_SENT);
    await sendMessage(text);
  };

  const statusLabel = error
    ? t('offline')
    : isBootstrapping
    ? t('connecting')
    : isConnected
    ? t('liveBadge')
    : t('connecting');

  return (
    <>
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          animation: 'v3fadeIn 0.3s ease',
          cursor: 'pointer',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('header')}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(90vw, 520px)',
          height: 'min(75vh, 560px)',
          background: 'rgba(15,15,15,0.95)',
          backdropFilter: 'blur(24px)',
          borderRadius: 14,
          boxShadow: '0 0 100px rgba(204,255,0,0.12), 0 0 0 1px rgba(204,255,0,0.2)',
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'v3slideUp 0.4s cubic-bezier(0.2,0.9,0.25,1)',
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            height: 40,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(204,255,0,0.04)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={close}
            aria-label="close"
            title="Close (Esc)"
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#ff5f57',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0,0,0,0.6)',
              fontSize: 14,
              lineHeight: 1,
              fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
              flexShrink: 0,
            }}
          >
            ×
          </button>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', flexShrink: 0 }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: 'rgba(204,255,0,0.6)',
              letterSpacing: '0.02em',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {t('header')} ·{' '}
            <strong
              style={{
                color: error ? '#ff5f57' : 'rgba(204,255,0,0.9)',
                fontWeight: 600,
              }}
            >
              {statusLabel}
            </strong>
          </span>
          <button
            onClick={close}
            aria-label="close"
            title="Close (Esc)"
            style={{
              background: 'transparent',
              border: '1px solid rgba(245,245,242,0.15)',
              color: 'rgba(245,245,242,0.7)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.08em',
              padding: '4px 8px',
              borderRadius: 4,
              cursor: 'pointer',
              flexShrink: 0,
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ff5f57';
              e.currentTarget.style.color = '#ff5f57';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245,245,242,0.15)';
              e.currentTarget.style.color = 'rgba(245,245,242,0.7)';
            }}
          >
            × esc
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            padding: '16px 20px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Bot greeting (always shown) */}
          <div
            style={{
              background: 'rgba(204,255,0,0.06)',
              borderRadius: '12px 12px 12px 2px',
              padding: '10px 14px',
              maxWidth: '80%',
              fontSize: 13,
              color: 'rgba(245,245,242,0.85)',
              lineHeight: 1.5,
              alignSelf: 'flex-start',
            }}
          >
            {t('greeting')}
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                background:
                  m.direction === 'outgoing'
                    ? 'rgba(204,255,0,0.15)'
                    : 'rgba(204,255,0,0.06)',
                borderRadius:
                  m.direction === 'outgoing'
                    ? '12px 12px 2px 12px'
                    : '12px 12px 12px 2px',
                padding: '10px 14px',
                maxWidth: '80%',
                fontSize: 13,
                color:
                  m.direction === 'outgoing' ? '#f5f5f2' : 'rgba(245,245,242,0.85)',
                lineHeight: 1.5,
                alignSelf: m.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                animation: 'v3fadeIn 0.3s ease',
                opacity: m.status === 'sending' ? 0.6 : 1,
                border: m.status === 'error' ? '1px solid rgba(255,95,87,0.4)' : 'none',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {m.content}
              {m.status === 'error' && (
                <div
                  style={{
                    fontSize: 10,
                    color: '#ff5f57',
                    marginTop: 4,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {t('sendError')}
                </div>
              )}
            </div>
          ))}

          {isAgentTyping && (
            <div
              style={{
                display: 'flex',
                gap: 4,
                padding: '8px 14px',
                alignItems: 'center',
                animation: 'v3fadeIn 0.3s ease',
                alignSelf: 'flex-start',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'rgba(204,255,0,0.5)',
                    animation: `v3blink 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
              <span
                style={{
                  fontSize: 10,
                  color: 'rgba(245,245,242,0.4)',
                  marginLeft: 6,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {t('agentTyping')}
              </span>
            </div>
          )}

          {error && (
            <div
              style={{
                fontSize: 11,
                color: '#ff5f57',
                padding: '8px 12px',
                fontFamily: 'JetBrains Mono, monospace',
                alignSelf: 'flex-start',
              }}
            >
              {t('initError')}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('placeholder')}
            disabled={isBootstrapping}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(245,245,242,0.04)',
              border: '1px solid rgba(245,245,242,0.08)',
              color: '#f5f5f2',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="submit"
            disabled={!draft.trim() || isBootstrapping}
            style={{
              background: '#ccff00',
              color: '#0a0a0a',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: !draft.trim() || isBootstrapping ? 'default' : 'pointer',
              opacity: !draft.trim() || isBootstrapping ? 0.4 : 1,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.02em',
            }}
          >
            {t('send')}
          </button>
        </form>
      </div>
    </>
  );
}
