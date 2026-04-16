'use client';

import { useLocale } from 'next-intl';
import ServiceLayout from '@/components/ServiceLayout';
import FaqSchema from '@/components/seo/FaqSchema';
import { SERVICE_FAQS } from '@/lib/faqs';

/**
 * Vision artificial — served via shared ServiceLayout.
 * Honest framing: capability en construccion, sin proyectos propios de CV en produccion aun.
 */
export default function ComputerVisionPage() {
  const locale = useLocale();
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/vision-artificial y quiero conversar sobre un proyecto experimental de computer vision.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const faqs = SERVICE_FAQS['vision-artificial'][locale === 'en' ? 'en' : 'es'];

  return (
    <>
      <ServiceLayout
        service={{
          serviceKey: 'computerVision',
          ctaHref: '/contacto',
          whatsappHref,
        }}
      />
      <FaqSchema faqs={faqs} />
    </>
  );
}
