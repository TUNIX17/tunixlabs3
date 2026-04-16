'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Business Intelligence — served via shared ServiceLayout.
 */
export default function BusinessIntelligencePage() {
  return (
    <ServiceLayout
      service={{
        serviceKey: 'businessIntelligence',
        ctaHref: '/contacto',
      }}
    />
  );
}
