/**
 * Email Template: Oferta de Llamada Gratuita
 * Se envía 48h después si no hay interacción.
 */

interface OfferCallEmailProps {
  leadName: string;
}

export function getOfferCallEmailSubject(leadName: string): string {
  return `${leadName}, última oportunidad: 30 min gratis de consultoría IA`;
}

export function getOfferCallEmailHtml({ leadName }: OfferCallEmailProps): string {
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
        Oferta exclusiva
      </p>
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">
        30 minutos de consultoría gratis
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Hola ${leadName || 'nuevamente'},
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Sé que estás ocupado/a, y no quiero ser insistente. Pero creo genuinamente
        que una conversación de 30 minutos puede ser muy valiosa para ti.
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Por eso te ofrezco una <strong>sesión de consultoría 100% gratuita</strong>
        donde analizaremos juntos:
      </p>

      <!-- Benefits List -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 0 0 25px 0; border-left: 4px solid #ccff00;">
        <ul style="color: #1f2937; line-height: 2; margin: 0; padding-left: 20px;">
          <li><strong>Diagnóstico rápido</strong> de oportunidades de IA en tu empresa</li>
          <li><strong>Quick wins</strong> que puedes implementar en semanas, no meses</li>
          <li><strong>Estimación de ROI</strong> realista para tu caso específico</li>
          <li><strong>Roadmap sugerido</strong> de implementación</li>
        </ul>
      </div>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 10px 0;">
        <strong>Sin compromiso. Sin ventas agresivas.</strong>
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Solo una conversación entre profesionales para ver si tiene sentido
        trabajar juntos.
      </p>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:contacto@tunixlabs.com?subject=Quiero%20mi%20consultoria%20gratuita"
           style="display: inline-block; background: #ccff00;
                  color: #0a0a0a; text-decoration: none; padding: 16px 40px; border-radius: 8px;
                  font-weight: 700; font-size: 18px;">
          Agendar mi sesión gratis
        </a>
      </div>

      <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0 0 25px 0;">
        Responde este email o escríbeme directamente
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Si no es el momento adecuado, lo entiendo perfectamente. Pero si en algún
        momento quieres explorar cómo la IA puede ayudar a tu empresa, mi puerta
        siempre está abierta.
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0;">
        Un abrazo,<br>
        <strong style="color: #1f2937;">Alejandro Moyano</strong><br>
        <span style="color: #6b7280; font-size: 14px;">Fundador, Tunix Labs</span><br>
        <span style="color: #6b7280; font-size: 13px;">contacto@tunixlabs.com</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
        Tunix Labs · Sistemas de producción para industrias reguladas<br>
        Santiago, Chile
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0; text-align: center;">
        Este es el último email de esta secuencia.<br>
        <a href="#unsubscribe" style="color: #9ca3af;">No quiero recibir más emails</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}
