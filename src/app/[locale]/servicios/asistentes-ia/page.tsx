'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Asistentes IA — served via shared ServiceLayout.
 * Content is read from i18n (`Services.aiAssistants` + `HomePage.services.items.aiAssistants`)
 * so copy stays in sync with the home card and can vary ES vs EN without literal translation.
 */
export default function AiAssistantsPage() {
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/asistentes-ia y quiero conversar sobre un proyecto de voice AI o agentes.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <ServiceLayout
      service={{
        serviceKey: 'aiAssistants',
        ctaHref: '/contacto',
        whatsappHref,
      }}
    />
  );
}
