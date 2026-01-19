'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FiMail, FiPhone, FiMessageCircle, FiSend, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';

export default function ContactoPage() {
  const t = useTranslations('ContactPage');
  const tFooter = useTranslations('HomePage.footer');

  return (
    <div className="min-h-screen neu-bg" style={{ backgroundColor: 'var(--neu-bg)' }}>
      {/* HERO - Neumorphic */}
      <section className="w-full py-16 sm:py-20 px-4 neu-bg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-400 mix-blend-multiply opacity-20 filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-500 mix-blend-multiply opacity-20 filter blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 pt-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold neu-gradient-text mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: '#718096', lineHeight: '1.7' }}>
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* FORMULARIO Y DATOS - Neumorphic */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="neu-raised p-6 sm:p-8 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2d3748' }}>
            <FiMessageCircle className="h-6 w-6" style={{ color: 'var(--neu-primary)' }} />
            {t('form.title')}
          </h2>

          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('form.name')}</label>
                <input id="nombre" name="nombre" type="text" required placeholder={t('form.namePlaceholder')} className="neu-input" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('form.email')}</label>
                <input id="email" name="email" type="email" required placeholder={t('form.emailPlaceholder')} className="neu-input" />
              </div>
            </div>

            <div>
              <label htmlFor="asunto" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('form.subject')}</label>
              <input id="asunto" name="asunto" type="text" required placeholder={t('form.subjectPlaceholder')} className="neu-input" />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('form.message')}</label>
              <textarea id="mensaje" name="mensaje" required rows={5} placeholder={t('form.messagePlaceholder')} className="neu-input resize-none" />
            </div>

            <a
              href="mailto:contacto@tunixlabs.com?subject=Contacto desde TunixLabs&body=Hola, me gustaría obtener más información sobre sus servicios de IA."
              className="neu-btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              <FiSend className="h-5 w-5" /> {t('form.submit')}
            </a>
          </form>
        </div>

        {/* Datos de contacto */}
        <div className="neu-raised p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2d3748' }}>
              <FiMail className="h-6 w-6" style={{ color: 'var(--neu-primary)' }} />
              {t('directContact.title')}
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiMail className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </div>
                <span style={{ color: '#718096' }}>contacto@tunixlabs.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiPhone className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </div>
                <span style={{ color: '#718096' }}>+34 600 123 456</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2d3748' }}>{t('directContact.socialMedia')}</h3>
              <div className="flex gap-4">
                <a href="#" aria-label="Instagram" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiInstagram className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </a>
                <a href="#" aria-label="LinkedIn" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiLinkedin className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </a>
                <a href="#" aria-label="Twitter" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                  <FiTwitter className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} />
                </a>
              </div>
            </div>
          </div>

          <div className="neu-pressed p-6 rounded-xl text-center">
            <p className="text-lg font-semibold mb-3 neu-gradient-text">{t('directContact.meetingQuestion')}</p>
            <a href="mailto:contacto@tunixlabs.com" className="neu-btn-primary inline-block">
              {t('directContact.scheduleCall')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 neu-bg text-center" style={{ color: '#718096' }}>
        <p>&copy; 2026 {tFooter('copyright')}</p>
      </footer>
    </div>
  );
}
