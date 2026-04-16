'use client';

import { useLocale } from 'next-intl';
import ServiceLayout from '@/components/ServiceLayout';
import FaqSchema from '@/components/seo/FaqSchema';
import { SERVICE_FAQS } from '@/lib/faqs';

/**
 * RPA con IA — served via shared ServiceLayout.
 */
export default function RpaPage() {
  const locale = useLocale();
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/rpa y quiero automatizar procesos repetitivos.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const faqs = SERVICE_FAQS['rpa'][locale === 'en' ? 'en' : 'es'];

  return (
    <>
      <ServiceLayout
        service={{
          serviceKey: 'rpa',
          ctaHref: '/contacto',
          whatsappHref,
        }}
      />
      <FaqSchema faqs={faqs} />
    </>
  );
}
