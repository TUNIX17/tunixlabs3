'use client';

import { useLocale } from 'next-intl';
import ServiceLayout from '@/components/ServiceLayout';
import FaqSchema from '@/components/seo/FaqSchema';
import { SERVICE_FAQS } from '@/lib/faqs';

/**
 * Business Intelligence — served via shared ServiceLayout.
 */
export default function BusinessIntelligencePage() {
  const locale = useLocale();
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/business-intelligence y quiero conversar sobre dashboards operacionales.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const faqs = SERVICE_FAQS['business-intelligence'][locale === 'en' ? 'en' : 'es'];

  return (
    <>
      <ServiceLayout
        service={{
          serviceKey: 'businessIntelligence',
          ctaHref: '/contacto',
          whatsappHref,
        }}
      />
      <FaqSchema faqs={faqs} />
    </>
  );
}
