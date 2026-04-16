'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { BsChatDots } from 'react-icons/bs';
import { trackEvent, Events } from '@/lib/analytics/track';
import { useTerminalChat } from '@/components/TerminalChat';

export type ServiceContent = {
  serviceKey: string;
  ctaHref: string;
};

type Props = {
  service: ServiceContent;
};

export default function ServiceLayout({ service }: Props) {
  const servicesT = useTranslations(`Services.${service.serviceKey}`);
  const homeServicesT = useTranslations(
    `HomePage.services.items.${service.serviceKey}`
  );
  const layoutT = useTranslations('ServiceLayout');
  const footerT = useTranslations('Footer');
  const { open: openTerminal } = useTerminalChat();

  useEffect(() => {
    trackEvent(Events.PAGE_VIEW_SERVICE, { service: service.serviceKey });
  }, [service.serviceKey]);

  const stack = homeServicesT.raw('stack') as string[];

  return (
    <div className="min-h-screen pt-20">
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Link
            href="/inicio"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4" />
            {layoutT('backButton')}
          </Link>
          <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] text-white/60">
            {servicesT('hero.badge')}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          {servicesT('hero.title')}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
          {servicesT('hero.description')}
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-white/80">
          {layoutT('overviewTitle')}
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-base leading-relaxed text-white/60 sm:text-lg">
            {homeServicesT('longDescription')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-white/80">
          {layoutT('stackTitle')}
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <ul className="flex flex-wrap justify-center gap-3">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/70"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-white/80">
          {layoutT('anchorTitle')}
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <FiCheckCircle
              className="mt-1 h-6 w-6 flex-shrink-0 text-[#ccff00]"
              aria-hidden="true"
            />
            <p className="text-base leading-relaxed text-white/60 sm:text-lg">
              {homeServicesT('anchorProject')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
            {layoutT('ctaTitle')}
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              className="inline-flex items-center gap-3 rounded-xl bg-[#ccff00] px-6 py-4 font-semibold text-[#0a0a0a] transition hover:-translate-y-0.5 hover:bg-[#b8e600] cursor-pointer"
              onClick={() => {
                trackEvent(Events.CTA_WHATSAPP_CLICK, {
                  location: `service:${service.serviceKey}`,
                });
                openTerminal();
              }}
            >
              <BsChatDots className="h-6 w-6" />
              {layoutT('ctaButton')}
            </button>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ccff00] px-6 py-4 font-semibold text-[#0a0a0a] transition hover:bg-[#b8e600]"
              onClick={() =>
                trackEvent(Events.CTA_FULL_FORM_CLICK, {
                  location: `service:${service.serviceKey}`,
                })
              }
            >
              {layoutT('ctaSecondary')}
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 text-center">
        <p className="mx-auto max-w-3xl text-xs leading-relaxed text-white/30">
          {footerT('disclaimer')}
        </p>
        <p className="mt-2 text-sm text-white/40">
          &copy; 2026 {footerT('copyright')}
        </p>
      </footer>
    </div>
  );
}
