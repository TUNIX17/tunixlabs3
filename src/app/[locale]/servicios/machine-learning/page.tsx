'use client';

import ServiceLayout from '@/components/ServiceLayout';

/**
 * Machine Learning aplicado — served via shared ServiceLayout.
 * Anchor: MIT Professional Education ML training + Dataiku DSS + Python + Claude.
 */
export default function MachineLearningPage() {
  return (
    <ServiceLayout
      service={{
        serviceKey: 'machineLearning',
        ctaHref: '/contacto',
      }}
    />
  );
}
