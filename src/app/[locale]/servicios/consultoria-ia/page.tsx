'use client';

import { useLocale } from 'next-intl';
import ServiceLayout from '@/components/ServiceLayout';
import FaqSchema from '@/components/seo/FaqSchema';
import { SERVICE_FAQS } from '@/lib/faqs';

/**
 * Consultoria IA — served via shared ServiceLayout.
 */
export default function AiConsultingPage() {
  const locale = useLocale();
  const whatsappNumber = '56930367979';
  const whatsappMessage = encodeURIComponent(
    'Hola, vengo de tunixlabs.com/servicios/consultoria-ia y necesito una auditoria de arquitectura IA.'
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const faqs = SERVICE_FAQS['consultoria-ia'][locale === 'en' ? 'en' : 'es'];

  return (
    <>
      <ServiceLayout
        service={{
          serviceKey: 'aiConsulting',
          ctaHref: '/contacto',
          whatsappHref,
        }}
      />
      <FaqSchema faqs={faqs} />
    </>
  );
}
