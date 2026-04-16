'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Vision artificial — served via shared ServiceLayout.
 * Honest framing: capability en construccion, sin proyectos propios de CV en produccion aun.
 */
export default function ComputerVisionPage() {
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/vision-artificial y quiero conversar sobre un proyecto experimental de computer vision.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <ServiceLayout
      service={{
        serviceKey: 'computerVision',
        ctaHref: '/contacto',
        whatsappHref,
      }}
    />
  );
}
