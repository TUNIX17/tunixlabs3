'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * RPA con IA — served via shared ServiceLayout.
 */
export default function RpaPage() {
  return (
    <ServiceLayout
      service={{
        serviceKey: 'rpa',
        ctaHref: '/contacto',
      }}
    />
  );
}
