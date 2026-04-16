'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Consultoria IA — served via shared ServiceLayout.
 */
export default function AiConsultingPage() {
  return (
    <ServiceLayout
      service={{
        serviceKey: 'aiConsulting',
        ctaHref: '/contacto',
      }}
    />
  );
}
