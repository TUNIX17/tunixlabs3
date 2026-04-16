'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Vision artificial — served via shared ServiceLayout.
 * Honest framing: capability en construccion, sin proyectos propios de CV en produccion aun.
 */
export default function ComputerVisionPage() {
  return (
    <ServiceLayout
      service={{
        serviceKey: 'computerVision',
        ctaHref: '/contacto',
      }}
    />
  );
}
