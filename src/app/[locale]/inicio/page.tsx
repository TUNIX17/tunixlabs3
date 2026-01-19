'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Pathnames } from '@/i18n/routing';
import { HiOutlineGlobeAlt, HiOutlineChartBar, HiOutlineChatBubbleLeftRight, HiOutlinePresentationChartBar, HiOutlineCamera, HiOutlineLightBulb, HiOutlineCog8Tooth, HiOutlinePencilSquare, HiOutlineMegaphone } from 'react-icons/hi2';
import { BsWhatsapp } from 'react-icons/bs';
import React from 'react';
import dynamic from 'next/dynamic';

const RobotModel = dynamic(() => import('./components/RobotModel'), {
  ssr: false,
  loading: () => {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-blue-600 text-lg">Loading...</div>
      </div>
    );
  }
});

export default function HomePage() {
  const t = useTranslations('HomePage');
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const nodeCount = Math.min(Math.floor(window.innerWidth / 100), 20);

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    const drawNetwork = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );

          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, 0.4)';
        ctx.fill();

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      requestAnimationFrame(drawNetwork);
    };

    drawNetwork();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const services: Array<{ key: string; icon: typeof HiOutlineGlobeAlt; href: Pathnames }> = [
    { key: 'webDev', icon: HiOutlineGlobeAlt, href: '/servicios/desarrollos-web' },
    { key: 'machineLearning', icon: HiOutlineChartBar, href: '/servicios/machine-learning' },
    { key: 'aiAssistants', icon: HiOutlineChatBubbleLeftRight, href: '/servicios/asistentes-ia' },
    { key: 'businessIntelligence', icon: HiOutlinePresentationChartBar, href: '/servicios/business-intelligence' },
    { key: 'computerVision', icon: HiOutlineCamera, href: '/servicios/vision-artificial' },
    { key: 'aiConsulting', icon: HiOutlineLightBulb, href: '/servicios/consultoria-ia' },
    { key: 'rpa', icon: HiOutlineCog8Tooth, href: '/servicios/rpa' },
    { key: 'contentGeneration', icon: HiOutlinePencilSquare, href: '/servicios/generacion-contenido-ia' },
    { key: 'marketingAutomation', icon: HiOutlineMegaphone, href: '/servicios/automatizacion-marketing-ia' },
  ];

  return (
    <>
      {/* Aurora Blobs - Fixed position, visible across all pages */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>

      <div className="min-h-screen relative neu-bg" style={{backgroundColor: 'var(--neu-bg)'}}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 opacity-30"
        />

        <div className="parallax-wrapper">
          <section className="relative pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <div className="mt-16 lg:mt-20">
                  <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl" style={{color: '#2d3748'}}>
                    <span className="block">{t('hero.title1')}</span>
                    <span className="block neu-gradient-text">
                      {t('hero.title2')}
                    </span>
                    <span className="block">{t('hero.title3')}</span>
                  </h1>
                  <p className="mt-3 text-base sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{color: '#718096', lineHeight: '1.7'}}>
                    {t('hero.description')}
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                    <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                      <button className="neu-btn-primary">
                        {t('hero.cta.contact')}
                      </button>
                      <button className="neu-btn-secondary">
                        {t('hero.cta.services')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 relative sm:mx-auto lg:mt-0 lg:col-span-6 lg:flex lg:items-center lg:justify-center">
                <div className="neu-robot-container">
                  <div className="neu-robot-avatar">
                    <div className="robot-canvas-wrapper">
                      <RobotModel />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="py-16 neu-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--neu-primary)' }}>
                {t('services.badge')}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl neu-gradient-text">
                {t('services.title')}
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl" style={{ color: '#718096' }}>
                {t('services.subtitle')}
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Link key={service.key} href={service.href}>
                      <div className="neu-raised p-6 rounded-2xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                        <div className="neu-service-icon">
                          <Icon className="h-8 w-8" style={{ color: 'var(--neu-primary)' }} />
                        </div>
                        <h3 className="text-xl font-bold mt-4" style={{ color: '#2d3748' }}>
                          {t(`services.items.${service.key}.title`)}
                        </h3>
                        <p className="mt-2 text-sm" style={{ color: '#718096' }}>
                          {t(`services.items.${service.key}.description`)}
                        </p>
                        <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                          {t('services.learnMore')}
                          <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="py-16 neu-bg relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--neu-primary)' }}>
                {t('contact.badge')}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl neu-gradient-text">
                {t('contact.title')}
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl" style={{ color: '#718096' }}>
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
              <div className="neu-raised p-6 sm:p-8 rounded-2xl mb-10 lg:mb-0">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2d3748' }}>{t('contact.form.title')}</h3>
                  <p className="mt-2 text-sm" style={{ color: '#718096' }}>
                    {t('contact.form.description')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('contact.form.name')}</label>
                      <input
                        type="text"
                        id="name"
                        className="neu-input"
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('contact.form.email')}</label>
                      <input
                        type="email"
                        id="email"
                        className="neu-input"
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('contact.form.subject')}</label>
                    <input
                      type="text"
                      id="subject"
                      className="neu-input"
                      placeholder={t('contact.form.subjectPlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#2d3748' }}>{t('contact.form.message')}</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="neu-input resize-none"
                      placeholder={t('contact.form.messagePlaceholder')}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="mailto:contacto@tunixlabs.com?subject=Contacto desde TunixLabs&body=Hola, me gustaría obtener más información sobre sus servicios de IA."
                    className="neu-btn-primary w-full inline-block text-center"
                  >
                    {t('contact.form.submit')}
                  </a>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="max-w-md mx-auto lg:mr-0 lg:ml-auto">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#2d3748' }}>{t('contact.info.title')}</h3>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="neu-service-icon flex-shrink-0" style={{ width: '48px', height: '48px', margin: 0 }}>
                        <svg className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium" style={{ color: 'var(--text-dark)' }}>{t('contact.info.email')}</p>
                        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>contacto@tunixlabs.com</p>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/56930367979?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios%20de%20IA."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start group"
                    >
                      <div className="neu-service-icon flex-shrink-0 transition-all duration-300 group-hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0, background: 'linear-gradient(145deg, #25D366, #128C7E)' }}>
                        <BsWhatsapp className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium" style={{ color: 'var(--text-dark)' }}>WhatsApp</p>
                        <p className="mt-1 group-hover:text-green-600 transition-colors" style={{ color: 'var(--text-muted)' }}>{t('contact.info.whatsappCta')}</p>
                      </div>
                    </a>
                  </div>

                  <div className="mt-10">
                    <p className="text-lg font-medium mb-4" style={{ color: '#2d3748' }}>{t('contact.info.followUs')}</p>
                    <div className="flex justify-center lg:justify-start space-x-4">
                      <a href="#" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                        <svg className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a href="#" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                        <svg className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.948-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a href="#" className="neu-service-icon transition-all duration-300 hover:-translate-y-1" style={{ width: '48px', height: '48px', margin: 0 }}>
                        <svg className="h-5 w-5" style={{ color: 'var(--neu-primary)' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 neu-bg text-center" style={{ color: '#718096' }}>
          <p>&copy; 2026 {t('footer.copyright')}</p>
        </footer>
      </div>
    </div>
    </>
  );
}
