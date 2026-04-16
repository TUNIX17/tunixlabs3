'use client';

import { useLocale } from 'next-intl';
import ServiceLayout from '@/components/ServiceLayout';
import FaqSchema from '@/components/seo/FaqSchema';
import { SERVICE_FAQS } from '@/lib/faqs';

/**
 * Machine Learning aplicado — served via shared ServiceLayout.
 * Anchor: MIT Professional Education ML training + Dataiku DSS + Python + Claude.
 */
export default function MachineLearningPage() {
  const locale = useLocale();
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/machine-learning y tengo un proyecto de ML.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const faqs = SERVICE_FAQS['machine-learning'][locale === 'en' ? 'en' : 'es'];

  return (
    <>
      <ServiceLayout
        service={{
          serviceKey: 'machineLearning',
          ctaHref: '/contacto',
          whatsappHref,
        }}
      />
      <FaqSchema faqs={faqs} />
    </>
  );
}
