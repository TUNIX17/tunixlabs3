'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Machine Learning aplicado — served via shared ServiceLayout.
 * Anchor: MIT Professional Education ML training + Dataiku DSS + Python + Claude.
 */
export default function MachineLearningPage() {
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/machine-learning y tengo un proyecto de ML.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <ServiceLayout
      service={{
        serviceKey: 'machineLearning',
        ctaHref: '/contacto',
        whatsappHref,
      }}
    />
  );
}
