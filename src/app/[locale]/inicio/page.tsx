'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Pathnames } from '@/i18n/routing';
import {
  HiOutlineGlobeAlt,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCog8Tooth,
} from 'react-icons/hi2';
import {
  FiMail,
  FiBarChart2,
  FiZap,
  FiTrendingUp,
  FiEye,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import React from 'react';
import TrustedBy from '@/components/TrustedBy';
import CaseStudies from '@/components/CaseStudies';
import ProductShowcase from '@/components/ProductShowcase';
import AboutFounder from '@/components/AboutFounder';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { trackEvent, Events } from '@/lib/analytics/track';

/**
 * HomePage — portfolio-first restructure (sprint 2026-04-08).
 *
 * Section flow:
 *   Hero + ProductShowcase  (replaces former 3D robot that killed LCP)
 *   TrustedBy               (logo strip of direct partners)
 *   CaseStudies             (4 real cards with indirect attribution)
 *   Services                (7 anchored services, grid 3x3)
 *   AboutFounder            (bio + MIT credential modal trigger, now at the end
 *                            acting as the closing-argument before CTA)
 *   CTA                     (WhatsApp + full form link, no more mailto)
 *   Footer                  (disclaimer + copyright)
 *
 * Services reduced from 9 to 7: dropped automatizacion-marketing-ia and
 * generacion-contenido-ia (both marked "no funciona bien + no me gusta"
 * by the user in the sprint conversation). Dropped routes redirect to
 * this page's #servicios section via next.config.js.
 */
export default function HomePage() {
  const t = useTranslations('HomePage');
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Scroll-reveal container — any descendant `.reveal` fades in as it enters
  // the viewport. Reduced-motion users skip the observer entirely.
  const revealRootRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Background neural network canvas (purely decorative).
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
        radius: Math.random() * 2 + 1,
      });
    }

    let raf = 0;
    const drawNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
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

      raf = requestAnimationFrame(drawNetwork);
    };

    drawNetwork();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 7 services, each anchored to a real project in production.
  // Key matches HomePage.services.items.<key> in both es.json and en.json.
  const services: Array<{
    key: string;
    icon: typeof HiOutlineGlobeAlt;
    href: Pathnames;
  }> = [
    {
      key: 'aiAssistants',
      icon: HiOutlineChatBubbleLeftRight,
      href: '/servicios/asistentes-ia',
    },
    {
      key: 'businessIntelligence',
      icon: FiBarChart2,
      href: '/servicios/business-intelligence',
    },
    {
      key: 'webDev',
      icon: HiOutlineGlobeAlt,
      href: '/servicios/desarrollos-web',
    },
    {
      key: 'aiConsulting',
      icon: FiZap,
      href: '/servicios/consultoria-ia',
    },
    {
      key: 'rpa',
      icon: HiOutlineCog8Tooth,
      href: '/servicios/rpa',
    },
    {
      key: 'machineLearning',
      icon: FiTrendingUp,
      href: '/servicios/machine-learning',
    },
    {
      key: 'computerVision',
      icon: FiEye,
      href: '/servicios/vision-artificial',
    },
  ];

  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(t('whatsappMessage'));
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div
      ref={revealRootRef}
      className="min-h-screen relative neu-bg"
      style={{ backgroundColor: 'var(--neu-bg)' }}
    >
      {/* Aurora Blobs - Floating animated shapes */}
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      <div className="aurora-blob aurora-blob-4"></div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-30"
      />

      {/* HERO */}
        <section className="relative pt-20 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <div className="mt-16 lg:mt-20">
                  <h1
                    className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
                    style={{ color: '#2d3748' }}
                  >
                    <span className="block">{t('hero.title1')}</span>
                    <span className="block neu-gradient-text">
                      {t('hero.title2')}
                    </span>
                    <span className="block">{t('hero.title3')}</span>
                  </h1>
                  <p
                    className="mt-3 text-base sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
                    style={{ color: '#718096', lineHeight: '1.7' }}
                  >
                    {t('hero.description')}
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                    <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                      <Link
                        href="/contacto"
                        className="neu-btn-primary text-center"
                      >
                        {t('hero.cta.contact')}
                      </Link>
                      <a
                        href="#casos"
                        className="neu-btn-secondary text-center"
                      >
                        {t('hero.cta.services')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ProductShowcase replaces former 3D robot (LCP killer).
                  Self-contained component with its own responsive layout. */}
              <div className="mt-12 lg:mt-0 lg:col-span-6">
                <ProductShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* TrustedBy logo strip (direct partners only — no Codelco) */}
        <TrustedBy />

        {/* Case studies — 4 cards with indirect attribution */}
        <div id="casos">
          <CaseStudies />
        </div>

        {/* Services grid — 7 anchored services */}
        <section id="servicios" className="py-16 neu-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span
                className="neu-pressed inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase"
                style={{ color: 'var(--neu-primary)' }}
              >
                {t('services.badge')}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl neu-gradient-text">
                {t('services.title')}
              </h2>
              <p
                className="mt-3 max-w-2xl mx-auto text-xl"
                style={{ color: '#718096' }}
              >
                {t('services.subtitle')}
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      key={service.key}
                      href={service.href}
                      onClick={() =>
                        trackEvent(Events.SERVICE_CARD_CLICK, {
                          service: service.key,
                        })
                      }
                    >
                      <div
                        className="reveal neu-raised p-6 rounded-2xl group cursor-pointer h-full"
                        data-reveal-delay={((idx % 4) + 1) as 1 | 2 | 3 | 4}
                      >
                        <div className="neu-service-icon">
                          <Icon
                            className="h-8 w-8"
                            style={{ color: 'var(--neu-primary)' }}
                          />
                        </div>
                        <h3
                          className="text-xl font-bold mt-4"
                          style={{ color: '#2d3748' }}
                        >
                          {t(`services.items.${service.key}.title`)}
                        </h3>
                        <p
                          className="mt-2 text-sm"
                          style={{ color: '#718096' }}
                        >
                          {t(`services.items.${service.key}.shortDescription`)}
                        </p>
                        <span className="inline-flex items-center mt-4 text-sm font-medium neu-gradient-text group-hover:underline">
                          {t('services.learnMore')}
                          <svg
                            className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
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

        {/* Founder bio with MIT credential modal — moved to the end of the
            page as the closing-argument right before the CTA. The visitor
            has seen cases + services; this is the trust-close. */}
        <AboutFounder />

        {/* CTA — WhatsApp + full form (the email mailto was removed because
            mailto: hands off to Outlook/Mail clients that aren't always
            configured; the user loses the intent instead of converting). */}
        <section
          id="contacto"
          className="py-20 neu-bg relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl neu-gradient-text">
                {t('cta.title')}
              </h2>
              <p
                className="mt-4 max-w-2xl mx-auto text-xl"
                style={{ color: '#718096' }}
              >
                {t('cta.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised rounded-2xl p-6 flex flex-col items-center justify-center text-center group"
                style={{
                  background: 'linear-gradient(145deg, #25D366, #128C7E)',
                }}
                data-cta="whatsapp"
                onClick={() =>
                  trackEvent(Events.CTA_WHATSAPP_CLICK, { location: 'home' })
                }
              >
                <BsWhatsapp className="h-10 w-10 text-white mb-3" />
                <span className="text-lg font-bold text-white">
                  {t('cta.whatsapp')}
                </span>
              </a>

              <Link
                href="/contacto"
                className="neu-btn-primary rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 group"
                data-cta="email"
                onClick={() =>
                  trackEvent(Events.CTA_EMAIL_CLICK, {
                    location: 'home_cta_grid',
                    destination: 'contact_form',
                  })
                }
              >
                <FiMail className="h-10 w-10 mb-3" />
                <span className="text-lg font-bold">{t('cta.email')}</span>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/contacto"
                className="inline-flex items-center text-sm font-medium neu-gradient-text hover:underline"
                data-cta="full-form"
                onClick={() =>
                  trackEvent(Events.CTA_FULL_FORM_CLICK, { location: 'home' })
                }
              >
                {t('cta.fullForm')}
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <footer
          className="py-8 neu-bg text-center"
          style={{ color: '#718096' }}
        >
          <p
            className="max-w-3xl mx-auto text-xs mb-2 px-4"
            style={{ color: '#a0aec0' }}
          >
            {t('footer.disclaimer')}
          </p>
          <p>&copy; 2026 {t('footer.copyright')}</p>
        </footer>
    </div>
  );
}
