/**
 * Email Template: Oferta de Llamada Gratuita
 * Se envia 48h despues si no hay interaccion
 */

interface OfferCallEmailProps {
  leadName: string;
}

export function getOfferCallEmailSubject(leadName: string): string {
  return `${leadName}, ultima oportunidad: 30 min gratis de consultoria IA`;
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
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 30px; text-align: center;">
      <p style="color: #fef3c7; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
        Oferta Exclusiva
      </p>
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">
        30 Minutos de Consultoria Gratis
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Hola ${leadName || 'nuevamente'},
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Se que estas ocupado/a, y no quiero ser insistente. Pero creo genuinamente
        que una conversacion de 30 minutos podria ser muy valiosa para ti.
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Por eso, te ofrezco una <strong>sesion de consultoria 100% gratuita</strong>
        donde analizaremos juntos:
      </p>

      <!-- Benefits List -->
      <div style="background-color: #fffbeb; border-radius: 12px; padding: 25px; margin: 0 0 25px 0;">
        <ul style="color: #92400e; line-height: 2; margin: 0; padding-left: 20px;">
          <li><strong>Diagnostico rapido</strong> de oportunidades de IA en tu empresa</li>
          <li><strong>Quick wins</strong> que puedes implementar en semanas, no meses</li>
          <li><strong>Estimacion de ROI</strong> realista para tu caso especifico</li>
          <li><strong>Roadmap sugerido</strong> de implementacion</li>
        </ul>
      </div>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 10px 0;">
        <strong>Sin compromiso. Sin ventas agresivas.</strong>
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Solo una conversacion entre profesionales para ver si tiene sentido
        trabajar juntos.
      </p>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:contacto@tunixlabs.com?subject=Quiero%20mi%20consultoria%20gratuita"
           style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
                  color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px;
                  font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(245,158,11,0.3);">
          Agendar Mi Sesion Gratis
        </a>
      </div>

      <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0 0 25px 0;">
        Responde este email o escribeme directamente
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Si no es el momento adecuado, lo entiendo perfectamente. Pero si en algun
        momento quieres explorar como la IA puede ayudar a tu empresa, mi puerta
        siempre esta abierta.
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0;">
        Un abrazo,<br>
        <strong style="color: #1f2937;">Alejandro Moyano</strong><br>
        <span style="color: #6b7280; font-size: 14px;">Fundador, TunixLabs</span><br>
        <span style="color: #6b7280; font-size: 13px;">contacto@tunixlabs.com</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
        TunixLabs - Consultoria en Inteligencia Artificial<br>
        Santiago, Chile
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0; text-align: center;">
        Este es el ultimo email de esta secuencia.<br>
        <a href="#unsubscribe" style="color: #9ca3af;">No quiero recibir mas emails</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}
