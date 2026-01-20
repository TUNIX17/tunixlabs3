/**
 * ActionButtons Component
 * Muestra botones de accion (Calendly, WhatsApp) cuando el robot los menciona
 * Incluye resumen de la conversacion en los mensajes
 */

import React, { useMemo } from 'react';
import { getCalendlyLink, DEFAULT_AGENT_CONFIG } from '@/lib/agent/AgentConfig';

interface ConversationSummary {
  name?: string;
  company?: string;
  interests?: string[];
  painPoints?: string[];
  lastTopic?: string;
}

interface ActionButtonsProps {
  robotResponse: string;
  className?: string;
  conversationSummary?: ConversationSummary;
}

// Keywords que activan los botones - MÁS ESPECÍFICOS para evitar falsos positivos
// Solo se activan cuando el robot ofrece explícitamente estas opciones de contacto
const CALENDLY_KEYWORDS = [
  'calendly',
  'agendar una llamada',
  'agendar una reunion',
  'agendar una cita',
  'schedule a call',
  'schedule a meeting',
  'book a call',
  'booking a meeting',
  'horarios disponibles',
  'available times',
  '15 minutos con alejandro',
  '15 minutes with alejandro',
  'agendar directamente',
  'schedule directly'
];

const WHATSAPP_KEYWORDS = [
  'whatsapp',
  'whats app',
  'escribirle por whatsapp',
  'escribir por whatsapp',
  'mensaje por whatsapp',
  'contactar por whatsapp',
  'contact on whatsapp',
  'message on whatsapp',
  '+56 9 3036 7979',
  '+56930367979'
];

/**
 * Detecta si el texto contiene keywords de Calendly
 */
const shouldShowCalendly = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return CALENDLY_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

/**
 * Detecta si el texto contiene keywords de WhatsApp
 */
const shouldShowWhatsApp = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return WHATSAPP_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

/**
 * Genera un mensaje personalizado para WhatsApp basado en el contexto
 */
const generateWhatsAppMessage = (summary?: ConversationSummary): string => {
  const parts: string[] = ['Hola Alejandro! Acabo de hablar con Tunix en tu web.'];

  if (summary) {
    // Nombre y empresa
    if (summary.name) {
      parts.push(`Soy ${summary.name}${summary.company ? ` de ${summary.company}` : ''}.`);
    }

    // Intereses
    if (summary.interests && summary.interests.length > 0) {
      const interestMap: Record<string, string> = {
        'consulting': 'consultoria en IA',
        'development': 'desarrollo de software con IA',
        'automation': 'automatizacion inteligente',
        'generative': 'IA generativa'
      };
      const interestNames = summary.interests
        .filter(i => i !== 'meeting')
        .map(i => interestMap[i] || i)
        .filter(Boolean);
      if (interestNames.length > 0) {
        parts.push(`Me interesa: ${interestNames.join(', ')}.`);
      }
    }

    // Pain points (resumido)
    if (summary.painPoints && summary.painPoints.length > 0) {
      parts.push(`Necesito ayuda con: ${summary.painPoints[0]}.`);
    }
  }

  // Mensaje final
  parts.push('Me gustaria agendar una reunion para discutir como pueden ayudarme.');

  return parts.join(' ');
};

/**
 * Genera link de WhatsApp con mensaje personalizado
 */
const getWhatsAppLink = (summary?: ConversationSummary): string => {
  const config = DEFAULT_AGENT_CONFIG.contactInfo;
  const message = generateWhatsAppMessage(summary);
  const phone = config.whatsapp?.replace(/[^0-9]/g, '') || '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  robotResponse,
  className = '',
  conversationSummary
}) => {
  // Determinar que botones mostrar basado en la respuesta
  const { showCalendly, showWhatsApp } = useMemo(() => {
    if (!robotResponse) {
      return { showCalendly: false, showWhatsApp: false };
    }
    return {
      showCalendly: shouldShowCalendly(robotResponse),
      showWhatsApp: shouldShowWhatsApp(robotResponse)
    };
  }, [robotResponse]);

  // Si no hay botones que mostrar, no renderizar nada
  if (!showCalendly && !showWhatsApp) {
    return null;
  }

  const calendlyLink = getCalendlyLink();
  const whatsappLink = getWhatsAppLink(conversationSummary);

  return (
    <div className={`action-buttons flex flex-wrap gap-3 justify-center mt-4 ${className}`}>
      {showCalendly && calendlyLink && (
        <a
          href={calendlyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700
                     text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg
                     hover:from-blue-700 hover:to-blue-800 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
          Agendar en Calendly
        </a>
      )}

      {showWhatsApp && whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600
                     text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg
                     hover:from-green-600 hover:to-green-700 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Escribir por WhatsApp
        </a>
      )}
    </div>
  );
};

export default ActionButtons;
