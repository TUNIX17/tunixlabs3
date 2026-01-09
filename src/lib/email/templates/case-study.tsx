/**
 * Email Template: Caso de Exito
 * Se envia 24h despues si no hay interaccion
 */

interface CaseStudyEmailProps {
  leadName: string;
  interests: string[];
}

export function getCaseStudyEmailSubject(): string {
  return `Como ayudamos a una empresa a reducir costos 40% con IA`;
}

export function getCaseStudyEmailHtml({ leadName, interests }: CaseStudyEmailProps): string {
  // Seleccionar caso de exito relevante segun intereses
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
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
      <p style="color: #e0e7ff; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
        Caso de Exito
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
        Queria compartir contigo un caso que creo te puede interesar, dado tu interes
        en ${interests[0] || 'soluciones de IA'}:
      </p>

      <!-- Case Study Card -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 0 0 25px 0; border-left: 4px solid #6366f1;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">
          ${caseStudy.client}
        </h3>

        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0;">
          <strong>Desafio:</strong> ${caseStudy.challenge}
        </p>

        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0;">
          <strong>Solucion:</strong> ${caseStudy.solution}
        </p>

        <!-- Results -->
        <div style="display: flex; justify-content: space-around; margin-top: 20px; text-align: center;">
          ${caseStudy.results.map(r => `
            <div style="flex: 1;">
              <div style="color: #6366f1; font-size: 28px; font-weight: 700;">${r.value}</div>
              <div style="color: #6b7280; font-size: 12px; margin-top: 5px;">${r.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Cada empresa es unica, pero los principios son similares. Me encantaria
        explorar como podemos lograr resultados similares en tu caso.
      </p>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:contacto@tunixlabs.com?subject=Quiero%20saber%20mas%20sobre%20casos%20de%20exito"
           style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                  color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px;
                  font-weight: 600; font-size: 16px;">
          Quiero Resultados Similares
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
        TunixLabs - Consultoria en Inteligencia Artificial<br>
        Santiago, Chile | contacto@tunixlabs.com
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

function selectRelevantCaseStudy(interests: string[]): CaseStudy {
  const interestLower = interests.map(i => i.toLowerCase()).join(' ');

  // Caso para automatizacion/RPA
  if (interestLower.includes('automat') || interestLower.includes('rpa') || interestLower.includes('proceso')) {
    return {
      title: 'Automatizacion que ahorra 200 horas/mes',
      client: 'Empresa de Servicios Financieros',
      challenge: 'Procesamiento manual de 500+ documentos diarios con errores frecuentes.',
      solution: 'Implementamos RPA con IA para extraccion y validacion automatica de datos.',
      results: [
        { value: '40%', label: 'Reduccion costos' },
        { value: '200h', label: 'Ahorro mensual' },
        { value: '99%', label: 'Precision' }
      ]
    };
  }

  // Caso para chatbots/asistentes
  if (interestLower.includes('chatbot') || interestLower.includes('asistente') || interestLower.includes('atencion')) {
    return {
      title: 'Chatbot que atiende 24/7 sin descanso',
      client: 'E-commerce de Retail',
      challenge: 'Saturacion del equipo de soporte con consultas repetitivas.',
      solution: 'Chatbot con IA que resuelve el 70% de consultas automaticamente.',
      results: [
        { value: '70%', label: 'Consultas auto' },
        { value: '24/7', label: 'Disponibilidad' },
        { value: '4.8', label: 'Satisfaccion' }
      ]
    };
  }

  // Caso para analytics/BI
  if (interestLower.includes('dashboard') || interestLower.includes('analy') || interestLower.includes('datos') || interestLower.includes('bi')) {
    return {
      title: 'Dashboards que predicen el futuro',
      client: 'Empresa de Logistica',
      challenge: 'Decisiones basadas en intuicion, no en datos.',
      solution: 'BI con ML para prediccion de demanda y optimizacion de rutas.',
      results: [
        { value: '25%', label: 'Menos costos' },
        { value: '15%', label: 'Mas eficiencia' },
        { value: '95%', label: 'Prediccion' }
      ]
    };
  }

  // Caso generico
  return {
    title: 'IA que transforma operaciones',
    client: 'Empresa de Manufactura',
    challenge: 'Procesos lentos y costosos sin visibilidad de datos.',
    solution: 'Suite de IA para automatizacion y analisis predictivo.',
    results: [
      { value: '35%', label: 'Reduccion costos' },
      { value: '50%', label: 'Mas rapido' },
      { value: '3x', label: 'ROI en 6 meses' }
    ]
  };
}
