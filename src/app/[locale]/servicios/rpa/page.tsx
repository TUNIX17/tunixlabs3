'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * RPA con IA — served via shared ServiceLayout.
 */
export default function RpaPage() {
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/rpa y quiero automatizar procesos repetitivos.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <ServiceLayout
      service={{
        serviceKey: 'rpa',
        ctaHref: '/contacto',
        whatsappHref,
      }}
    />
  );
}
