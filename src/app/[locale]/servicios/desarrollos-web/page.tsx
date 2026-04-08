'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Desarrollos Web / SaaS verticales — served via shared ServiceLayout.
 */
export default function WebDevPage() {
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/desarrollos-web y quiero conversar sobre un SaaS vertical.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <ServiceLayout
      service={{
        serviceKey: 'webDev',
        ctaHref: '/contacto',
        whatsappHref,
      }}
    />
  );
}
