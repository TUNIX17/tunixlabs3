/**
 * ActionButtons Component
 * Muestra botones de accion (Calendly, WhatsApp) cuando el robot los menciona
 * Incluye resumen de la conversacion en los mensajes
 */

import React, { useMemo } from 'react';
import { getCalendlyLink } from '@/lib/agent/AgentConfig';
import { useTerminalChat } from '@/components/TerminalChat';

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

const ActionButtons: React.FC<ActionButtonsProps> = ({
  robotResponse,
  className = '',
}) => {
  const { open: openTerminal } = useTerminalChat();
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

      {showWhatsApp && (
        <button
          type="button"
          onClick={() => openTerminal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ccff00]
                     text-[#0a0a0a] rounded-lg text-sm font-semibold shadow-md hover:shadow-lg
                     hover:bg-[#b8e600] transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-[#ccff00] focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
          Iniciar chat
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
