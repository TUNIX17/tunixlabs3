/**
 * Email Template: Bienvenida
 * Se envia inmediatamente cuando se captura un lead con email
 */

interface WelcomeEmailProps {
  leadName: string;
  interests: string[];
}

export function getWelcomeEmailSubject(leadName: string): string {
  return `${leadName}, gracias por tu interes en TunixLabs`;
}

export function getWelcomeEmailHtml({ leadName, interests }: WelcomeEmailProps): string {
  const interestsList = interests.length > 0
    ? interests.map(i => `<li>${i}</li>`).join('')
    : '<li>Soluciones de Inteligencia Artificial</li>';

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
    <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
        TunixLabs
      </h1>
      <p style="color: #ccfbf1; margin: 10px 0 0 0; font-size: 14px;">
        Consultoria en Inteligencia Artificial
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">
        Hola ${leadName || 'estimado/a'},
      </h2>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
        Gracias por conversar con Tunix, nuestro asistente virtual. Me alegra saber que
        estas interesado/a en explorar como la Inteligencia Artificial puede transformar
        tu negocio.
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0;">
        Segun nuestra conversacion, te interesan:
      </p>

      <ul style="color: #0d9488; line-height: 1.8; margin: 0 0 25px 0; padding-left: 20px;">
        ${interestsList}
      </ul>

      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0;">
        Soy <strong>Alejandro Moyano</strong>, fundador de TunixLabs. Me encantaria
        conocer mas sobre tu proyecto y explorar como podemos ayudarte a implementar
        soluciones de IA que generen resultados medibles.
      </p>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://tunixlabs.com"
           style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                  color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px;
                  font-weight: 600; font-size: 16px;">
          Conocer Nuestros Servicios
        </a>
      </div>

      <p style="color: #4b5563; line-height: 1.6; margin: 25px 0 0 0;">
        Te contactare pronto para coordinar una llamada de 15-30 minutos donde podamos
        profundizar en tus necesidades.
      </p>

      <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0;">
        Saludos cordiales,<br>
        <strong style="color: #1f2937;">Alejandro Moyano</strong><br>
        <span style="color: #6b7280; font-size: 14px;">Fundador, TunixLabs</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
        TunixLabs - Consultoria en Inteligencia Artificial<br>
        Santiago, Chile | contacto@tunixlabs.com
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0; text-align: center;">
        Recibes este email porque conversaste con nuestro asistente virtual.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}
