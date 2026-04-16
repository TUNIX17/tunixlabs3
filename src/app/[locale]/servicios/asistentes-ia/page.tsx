'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Asistentes IA — served via shared ServiceLayout.
 * Content is read from i18n (`Services.aiAssistants` + `HomePage.services.items.aiAssistants`)
 * so copy stays in sync with the home card and can vary ES vs EN without literal translation.
 */
export default function AiAssistantsPage() {
  return (
    <ServiceLayout
      service={{
        serviceKey: 'aiAssistants',
        ctaHref: '/contacto',
      }}
    />
  );
}
