import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';

const V3Client = dynamic(() => import('@/components/v3/V3Client'), {
  ssr: false,
});

export default async function InicioPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const isES = locale === 'es';
  return (
    <>
      <V3Client />
      {/* SEO fallback — crawlers see this when JS is disabled (ssr:false renders blank) */}
      <noscript>
        <div style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto', color: '#f5f5f2', fontFamily: 'system-ui' }}>
          <h1>{isES ? 'Tunix Labs — Construyo los sistemas que hacen funcionar empresas reales' : 'Tunix Labs — I build the systems that run real businesses'}</h1>
          <p>{isES ? 'Minería, energía, educación. 15 años operando antes de codear. MSc Finanzas + MIT AI/ML.' : 'Mining, energy, education. 15 years in operations before code. MSc Finance + MIT AI/ML.'}</p>
          <h2>{isES ? 'Casos en producción' : 'Production cases'}</h2>
          <ul>
            <li><a href={`/${locale}/casos/apoderapp`}>Apoderapp — {isES ? 'PWA con 88+ tests sii-factura' : 'PWA with 88+ sii-factura tests'}</a></li>
            <li><a href={`/${locale}/casos/fernandez`}>Fernández — {isES ? 'ERP metalúrgico full-stack' : 'Full-stack metallurgic ERP'}</a></li>
            <li><a href={`/${locale}/casos/schwager`}>Schwager — Voice AI {isES ? 'en faena minera (195+ operarios)' : 'in mining field (195+ workers)'}</a></li>
            <li><a href={`/${locale}/casos/sime`}>SIME — {isES ? '19,778 órdenes de trabajo digitalizadas' : '19,778 digital work orders'}</a></li>
            <li><a href={`/${locale}/casos/gasco`}>Gasco — {isES ? '4,040 códigos al 88.7% éxito' : '4,040 codes at 88.7% success'}</a></li>
            <li><a href={`/${locale}/casos/soma`}>SOMA — {isES ? 'KPI minero desde SAP Excel' : 'Mining KPIs from SAP Excel'}</a></li>
            <li><a href={`/${locale}/casos/speakly`}>Speakly — {isES ? 'Inglés 24/7 con avatar IA y profesor humano' : '24/7 English with AI avatar and human teacher'}</a></li>
          </ul>
          <h2>{isES ? 'Servicios' : 'Services'}</h2>
          <ul>
            <li><a href={`/${locale}/servicios/asistentes-ia`}>Voice AI</a></li>
            <li><a href={`/${locale}/servicios/business-intelligence`}>Business Intelligence</a></li>
            <li><a href={`/${locale}/servicios/desarrollos-web`}>{isES ? 'Desarrollo web y SaaS' : 'Web development & SaaS'}</a></li>
            <li><a href={`/${locale}/servicios/machine-learning`}>Machine Learning</a></li>
          </ul>
          <p><a href={`/${locale}/contacto`}>{isES ? 'Contacto' : 'Contact'}</a></p>
        </div>
      </noscript>
    </>
  );
}
