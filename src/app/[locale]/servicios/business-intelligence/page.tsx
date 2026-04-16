'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Business Intelligence — served via shared ServiceLayout.
 */
export default function BusinessIntelligencePage() {
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/business-intelligence y quiero conversar sobre dashboards operacionales.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <ServiceLayout
      service={{
        serviceKey: 'businessIntelligence',
        ctaHref: '/contacto',
        whatsappHref,
      }}
    />
  );
}
