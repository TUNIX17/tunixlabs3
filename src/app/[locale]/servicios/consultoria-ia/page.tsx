'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Consultoria IA — served via shared ServiceLayout.
 */
export default function AiConsultingPage() {
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/consultoria-ia y necesito una auditoria de arquitectura IA.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <ServiceLayout
      service={{
        serviceKey: 'aiConsulting',
        ctaHref: '/contacto',
        whatsappHref,
      }}
    />
  );
}
