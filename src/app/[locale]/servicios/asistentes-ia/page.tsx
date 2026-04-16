'use client';

import { useLocale } from 'next-intl';
import ServiceLayout from '@/components/ServiceLayout';
import FaqSchema from '@/components/seo/FaqSchema';
import { SERVICE_FAQS } from '@/lib/faqs';

/**
 * Asistentes IA — served via shared ServiceLayout.
 * Content is read from i18n (`Services.aiAssistants` + `HomePage.services.items.aiAssistants`)
 * so copy stays in sync with the home card and can vary ES vs EN without literal translation.
 */
export default function AiAssistantsPage() {
  const locale = useLocale();
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/asistentes-ia y quiero conversar sobre un proyecto de voice AI o agentes.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const faqs = SERVICE_FAQS['asistentes-ia'][locale === 'en' ? 'en' : 'es'];

  return (
    <>
      <ServiceLayout
        service={{
          serviceKey: 'aiAssistants',
          ctaHref: '/contacto',
          whatsappHref,
        }}
      />
      <FaqSchema faqs={faqs} />
    </>
  );
}
