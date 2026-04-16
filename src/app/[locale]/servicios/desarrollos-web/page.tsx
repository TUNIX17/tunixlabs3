'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Desarrollos Web / SaaS verticales — served via shared ServiceLayout.
 */
export default function WebDevPage() {
  return (
    <ServiceLayout
      service={{
        serviceKey: 'webDev',
        ctaHref: '/contacto',
      }}
    />
  );
}
