/**
 * Email Template: Caso de éxito
 * Se envía 24h después si no hay interacción.
 * Los casos mostrados son reales y coinciden con src/messages/*.json y
 * src/lib/cases-data.ts — jamás usar casos genéricos inventados aquí.
 */

interface CaseStudyEmailProps {
  leadName: string;
  interests: string[];
}

export function getCaseStudyEmailSubject(): string {
  return `Cómo Voice AI en faena procesa 4,000+ rutas diarias`;
}

export function getCaseStudyEmailHtml({ leadName, interests }: CaseStudyEmailProps): string {
  const caseStudy = selectRelevantCaseStudy(interests);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%); padding: 40px 30px; text-align: center;">
      <p style="color: #ccff00; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
        Caso en producción
      </p>
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
        ${caseStudy.title}
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Hola ${leadName || 'nuevamente'},
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Quería compartir contigo un sistema que corre hoy en producción,
        dado tu interés en ${interests[0] || 'soluciones de IA'}:
      </p>

      <!-- Case Study Card -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 0 0 25px 0; border-left: 4px solid #ccff00;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">
          ${caseStudy.client}
        </h3>

        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0;">
          <strong>Desafío:</strong> ${caseStudy.challenge}
        </p>

        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0;">
          <strong>Solución:</strong> ${caseStudy.solution}
        </p>

        <!-- Results -->
        <div style="display: flex; justify-content: space-around; margin-top: 20px; text-align: center;">
          ${caseStudy.results.map(r => `
            <div style="flex: 1;">
              <div style="color: #0a0a0a; font-size: 28px; font-weight: 700;">${r.value}</div>
              <div style="color: #6b7280; font-size: 12px; margin-top: 5px;">${r.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Cada empresa es única, pero los principios se repiten. Me encantaría
        explorar cómo podemos llegar a algo similar en tu caso.
      </p>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:contacto@tunixlabs.com?subject=Quiero%20conocer%20mas%20sobre%20casos%20en%20produccion"
           style="display: inline-block; background: #ccff00;
                  color: #0a0a0a; text-decoration: none; padding: 14px 35px; border-radius: 8px;
                  font-weight: 600; font-size: 16px;">
          Agendar una llamada
        </a>
      </div>

      <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0;">
        Saludos,<br>
        <strong style="color: #1f2937;">Alejandro</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
        Tunix Labs · Sistemas de producción para industrias reguladas<br>
        Santiago, Chile · contacto@tunixlabs.com
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0; text-align: center;">
        <a href="#unsubscribe" style="color: #9ca3af;">Dejar de recibir emails</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

interface CaseStudy {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
}

/**
 * Selector de caso por interés. Todos los casos son REALES y coinciden con
 * src/messages/*.json y src/lib/cases-data.ts. No se permiten casos sintéticos
 * acá — si agregas un interés nuevo, usa uno de los casos existentes.
 */
function selectRelevantCaseStudy(interests: string[]): CaseStudy {
  const interestLower = interests.map(i => i.toLowerCase()).join(' ');

  // RPA / automatización → gasco (bot de procesamiento de códigos)
  if (interestLower.includes('automat') || interestLower.includes('rpa') || interestLower.includes('proceso')) {
    return {
      title: '4,040 códigos procesados al 88.7% de éxito',
      client: 'Distribuidora regional de gas en Chile',
      challenge: 'Validación manual de códigos de quema en 14 rutas de reparto, con errores de transcripción y horas diarias de re-proceso antes de facturar.',
      solution: 'Bot de procesamiento automático con validación contra reglas de negocio, dashboard de métricas por ruta y reportería diaria. Stack commodity (Express + Prisma + React + PostgreSQL), cero licenciamiento enterprise.',
      results: [
        { value: '4,040', label: 'Códigos procesados' },
        { value: '88.7%', label: 'Tasa de éxito' },
        { value: '14', label: 'Rutas automatizadas' },
      ],
    };
  }

  // Voice AI / chatbots / asistentes → schwager
  if (interestLower.includes('chatbot') || interestLower.includes('asistente') || interestLower.includes('atencion') || interestLower.includes('voz') || interestLower.includes('voice')) {
    return {
      title: 'Voice AI en faena a menos de 100 ms',
      client: 'Schwager (servicios mineros, vía partner técnico)',
      challenge: 'Operarios mineros con guantes, bajo lluvia y con conectividad intermitente debían firmar formularios de mantención en papel; se extraviaban antes de llegar a auditoría.',
      solution: 'App móvil offline-first con Voice AI sobre Google Gemini: los operarios completan formularios hablando, sin sacarse los guantes. Firma multicanal con audit trail y parser SAP que detecta órdenes canceladas.',
      results: [
        { value: '195+', label: 'Operarios en faena' },
        { value: '4,000+', label: 'Rutas diarias' },
        { value: '<100 ms', label: 'Latencia de voz' },
      ],
    };
  }

  // BI / dashboards / analytics → sime
  if (interestLower.includes('dashboard') || interestLower.includes('analy') || interestLower.includes('datos') || interestLower.includes('bi') || interestLower.includes('kpi')) {
    return {
      title: '19,778 órdenes de trabajo digitalizadas',
      client: 'Contratistas en operaciones mineras críticas en Chile',
      challenge: 'Pautas de seguridad, mantenciones preventivas y órdenes de trabajo corrían en papel y planillas, sin trazabilidad digital entre la faena y la oficina central.',
      solution: 'Reemplazo completo del sistema legacy: 1,056 pautas, checklists por actividad, PDFs firmados con QR archivados en AWS S3, navegación histórica de KPIs y auditoría completa por turno minero.',
      results: [
        { value: '19,778', label: 'Órdenes de trabajo' },
        { value: '115K+', label: 'Actividades' },
        { value: '1,056', label: 'Pautas de seguridad' },
      ],
    };
  }

  // Fallback / genérico → fernandez (ERP custom)
  return {
    title: 'ERP que reemplazó Excel área por área',
    client: 'Empresa metalúrgica de 50 años',
    challenge: 'Toda la operación corría en Excel — RRHH, asistencia, finanzas, control de proyectos, CRM — durante la ausencia de los dueños, sin un ERP que reflejara el estado real del negocio.',
    solution: 'ERP custom con IA que reemplazó Excel en cada área crítica. Pipelines de OCR, QR y LLM Vision para digitalizar documentos en planta, integración completa con el SII y módulo de control de proyectos pensado para metalurgia, no para SaaS.',
    results: [
      { value: 'ERP', label: 'Full-stack' },
      { value: 'OCR + QR', label: 'Digitalización' },
      { value: 'SII', label: 'Integrado' },
    ],
  };
}
