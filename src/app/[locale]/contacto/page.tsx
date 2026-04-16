'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FiMail, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { BsChatDots } from 'react-icons/bs';
import { trackEvent, Events } from '@/lib/analytics/track';
import { useTerminalChat } from '@/components/TerminalChat';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

export default function ContactoPage() {
  const t = useTranslations('ContactPage');
  const { open: openTerminal } = useTerminalChat();

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    trackEvent(Events.CONTACT_FORM_SUBMIT);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setStatus('success');
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      trackEvent(Events.CONTACT_FORM_SUCCESS);
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setErrorMessage(message);
      trackEvent(Events.CONTACT_FORM_ERROR, { reason: message });
    }
  };

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#ccff00]/50 focus:ring-1 focus:ring-[#ccff00]/30 disabled:opacity-40';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="mx-auto max-w-4xl px-6 text-center">
        <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          // {t('hero.title').split(' ')[0]}
        </span>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/50">
          {t('hero.description')}
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 px-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
            <FiMail className="h-5 w-5 text-[#ccff00]" />
            {t('form.title')}
          </h2>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <FiCheck className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{t('form.successTitle')}</h3>
              <p className="text-white/50">{t('form.successMessage')}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 rounded-lg bg-[#ccff00] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#b8e600]"
              >
                {t('form.sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-white/70">
                    {t('form.name')}
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder={t('form.namePlaceholder')}
                    className={inputClass}
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/70">
                    {t('form.email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={t('form.emailPlaceholder')}
                    className={inputClass}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="asunto" className="mb-2 block text-sm font-medium text-white/70">
                  {t('form.subject')}
                </label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  required
                  placeholder={t('form.subjectPlaceholder')}
                  className={inputClass}
                  value={formData.asunto}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="mb-2 block text-sm font-medium text-white/70">
                  {t('form.message')}
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={5}
                  placeholder={t('form.messagePlaceholder')}
                  className={`${inputClass} resize-none`}
                  value={formData.mensaje}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <FiAlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                  <span className="text-sm text-red-300">{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ccff00] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#b8e600] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('form.sending')}
                  </>
                ) : (
                  <>
                    <FiSend className="h-5 w-5" /> {t('form.submit')}
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <FiMail className="h-5 w-5 text-[#ccff00]" />
              {t('directContact.title')}
            </h2>

            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <FiMail className="h-5 w-5 text-[#ccff00]" />
                </div>
                <span className="text-white/60">contacto@tunixlabs.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  trackEvent(Events.CTA_WHATSAPP_CLICK, { location: 'contact:info' });
                  openTerminal();
                }}
                className="group flex items-center gap-3 text-left"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#ccff00] transition-transform group-hover:-translate-y-0.5">
                  <BsChatDots className="h-5 w-5 text-[#0a0a0a]" />
                </div>
                <span className="text-white/60 transition-colors group-hover:text-[#ccff00]">
                  {t('directContact.whatsapp')}
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="mb-3 text-lg font-semibold text-white">
              {t('directContact.meetingQuestion')}
            </p>
            <button
              type="button"
              onClick={() => {
                trackEvent(Events.CTA_WHATSAPP_CLICK, { location: 'contact:schedule' });
                openTerminal();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#b8e600]"
            >
              <BsChatDots className="h-5 w-5" />
              {t('directContact.scheduleCall')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
