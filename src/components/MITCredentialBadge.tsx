'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FiExternalLink, FiX } from 'react-icons/fi';
import { trackEvent, Events } from '@/lib/analytics/track';

/**
 * MITCredentialBadge — inline button that wraps text (e.g. "MIT Professional
 * Education") and, on click, opens an accessible modal showing the founder's
 * scanned credential.
 *
 * Why this exists
 * ---------------
 * Claiming "MIT" in marketing copy is high-leverage but also high-skepticism.
 * The credibility multiplier only works if visitors can instantly verify the
 * claim is not inflated. A click-to-view modal that shows the actual credential
 * turns the claim into proof with zero extra page weight (the image is lazy
 * loaded on modal open via next/image).
 *
 * Accessibility
 * -------------
 * - role="dialog" + aria-modal="true"
 * - Initial focus moves into the dialog (close button) when opened.
 * - Focus trap via keydown handler (Tab / Shift+Tab cycles inside dialog).
 * - ESC closes the modal.
 * - Clicking the backdrop closes the modal.
 * - Prior focus is restored when the modal closes.
 *
 * Tracking
 * --------
 * - DIPLOMA_VIEW fires on open.
 * - DIPLOMA_CLOSE fires on close with `duration_ms` so we can see how long
 *   people actually read the credential (signal of skepticism vs trust).
 */

type Props = {
  children: React.ReactNode;
};

export default function MITCredentialBadge({ children }: Props) {
  const t = useTranslations('HomePage.credentials');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef<number | null>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    openedAtRef.current = Date.now();
    trackEvent(Events.DIPLOMA_VIEW);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    const openedAt = openedAtRef.current;
    if (openedAt !== null) {
      trackEvent(Events.DIPLOMA_CLOSE, {
        duration_ms: Date.now() - openedAt,
      });
      openedAtRef.current = null;
    }
    // Restore focus to the button that triggered the modal.
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  // Keyboard: ESC to close, Tab trap inside dialog.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Move focus into the dialog.
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Prevent body scroll while modal is open.
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
      // If component unmounts while open, still restore focus to the trigger
      // or the previously-focused element.
      (triggerRef.current ?? previouslyFocused)?.focus();
    };
  }, [open, handleClose]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-label={t('open')}
        className="inline-flex items-center gap-1 border-b border-dotted border-current pb-[1px] font-semibold transition-colors duration-200 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-sm"
        style={{ color: 'var(--neu-primary)' }}
      >
        {children}
        <FiExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mit-credential-title"
          aria-describedby="mit-credential-caption"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog panel */}
          <div
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
            className="neu-raised relative z-10 max-w-3xl w-full rounded-2xl p-4 sm:p-6 overflow-hidden"
            style={{ backgroundColor: 'var(--neu-bg)' }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3
                id="mit-credential-title"
                className="text-lg sm:text-xl font-bold neu-gradient-text"
              >
                {t('modalTitle')}
              </h3>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleClose}
                aria-label={t('close')}
                className="neu-pressed p-2 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ color: '#718096' }}
              >
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden neu-pressed p-2">
              {/*
                Using plain <img> instead of next/image here because the file
                lives in /public/credentials and we want it to load immediately
                on modal open without waiting for the next/image optimizer.
                The image itself is ~300 KB JPEG which is acceptable for a
                click-to-view asset.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/credentials/mit-professional-education.jpg"
                alt={t('altText')}
                className="w-full h-auto rounded-lg"
                loading="eager"
              />
            </div>

            <p
              id="mit-credential-caption"
              className="mt-4 text-sm leading-relaxed"
              style={{ color: '#4a5568' }}
            >
              {t('caption')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
