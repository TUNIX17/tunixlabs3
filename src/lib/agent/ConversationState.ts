/**
 * Estado de Conversacion del Agente
 * Tracking de fases, datos del lead y contexto de la conversacion
 */

/** Fases de la conversacion comercial */
export enum ConversationPhase {
  GREETING = 'greeting',              // Saludo inicial
  DISCOVERY = 'discovery',            // Entender necesidad del usuario
  QUALIFICATION = 'qualification',    // Calificar al prospecto
  PRESENTATION = 'presentation',      // Presentar servicios relevantes
  OBJECTION_HANDLING = 'objection',   // Manejar objeciones
  BOOKING = 'booking',                // Agendar reunion
  FAREWELL = 'farewell'               // Despedida
}

/** Datos capturados del lead */
export interface LeadData {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  role?: string;
  interest?: string[];              // Servicios de interes
  painPoints?: string[];            // Problemas mencionados
  budget?: string;
  timeline?: string;
  companySize?: string;
  location?: string;
  meetingScheduled?: boolean;
  calendarLink?: string;
}

/** Contexto de la conversacion */
export interface ConversationContext {
  phase: ConversationPhase;
  turnCount: number;
  leadData: Partial<LeadData>;
  objections: string[];
  lastTopic: string;
  language: string;
  sessionStartTime: number;
  lastActivityTime: number;
}

/** Transiciones validas entre fases */
const VALID_TRANSITIONS: Record<ConversationPhase, ConversationPhase[]> = {
  [ConversationPhase.GREETING]: [ConversationPhase.DISCOVERY],
  [ConversationPhase.DISCOVERY]: [ConversationPhase.QUALIFICATION, ConversationPhase.PRESENTATION],
  [ConversationPhase.QUALIFICATION]: [ConversationPhase.PRESENTATION, ConversationPhase.BOOKING],
  [ConversationPhase.PRESENTATION]: [ConversationPhase.OBJECTION_HANDLING, ConversationPhase.BOOKING, ConversationPhase.DISCOVERY],
  [ConversationPhase.OBJECTION_HANDLING]: [ConversationPhase.PRESENTATION, ConversationPhase.BOOKING],
  [ConversationPhase.BOOKING]: [ConversationPhase.FAREWELL],
  [ConversationPhase.FAREWELL]: [ConversationPhase.GREETING] // Permite reiniciar
};

/** Instrucciones por fase */
const PHASE_INSTRUCTIONS: Record<ConversationPhase, string> = {
  [ConversationPhase.GREETING]: 'Saluda brevemente y pregunta en que puedes ayudar. Se amigable pero profesional.',
  [ConversationPhase.DISCOVERY]: 'Haz preguntas abiertas para entender el problema o necesidad del usuario. Escucha activamente.',
  [ConversationPhase.QUALIFICATION]: 'Determina si es un buen prospecto: tamano de empresa, urgencia, presupuesto aproximado.',
  [ConversationPhase.PRESENTATION]: 'Presenta los 1-2 servicios mas relevantes de forma concisa. Conecta con sus necesidades.',
  [ConversationPhase.OBJECTION_HANDLING]: 'Aborda las objeciones con empatia. Ofrece informacion sin presionar.',
  [ConversationPhase.BOOKING]: 'Propone agendar una llamada de 15 minutos. Facilita el proceso.',
  [ConversationPhase.FAREWELL]: 'Despidete cordialmente. Confirma proximos pasos si los hay.'
};

/**
 * Clase para tracking del estado de conversacion
 */
export class AgentStateTracker {
  private context: ConversationContext;

  constructor(language: string = 'es') {
    const now = Date.now();
    this.context = {
      phase: ConversationPhase.GREETING,
      turnCount: 0,
      leadData: {},
      objections: [],
      lastTopic: '',
      language,
      sessionStartTime: now,
      lastActivityTime: now
    };
  }

  /**
   * Obtener contexto actual
   */
  getContext(): ConversationContext {
    return { ...this.context };
  }

  /**
   * Obtener fase actual
   */
  getPhase(): ConversationPhase {
    return this.context.phase;
  }

  /**
   * Obtener datos del lead
   */
  getLeadData(): Partial<LeadData> {
    return { ...this.context.leadData };
  }

  /**
   * Incrementar contador de turnos
   */
  incrementTurn(): void {
    this.context.turnCount++;
    this.context.lastActivityTime = Date.now();
  }

  /**
   * Actualizar fase de conversacion
   */
  updatePhase(newPhase: ConversationPhase): boolean {
    const currentPhase = this.context.phase;
    const validNextPhases = VALID_TRANSITIONS[currentPhase];

    if (!validNextPhases.includes(newPhase)) {
      console.warn(`[AgentState] Transicion invalida: ${currentPhase} -> ${newPhase}`);
      return false;
    }

    console.log(`[AgentState] Fase cambiada: ${currentPhase} -> ${newPhase}`);
    this.context.phase = newPhase;
    return true;
  }

  /**
   * Forzar cambio de fase (sin validar transicion)
   */
  forcePhase(phase: ConversationPhase): void {
    this.context.phase = phase;
  }

  /**
   * Actualizar datos del lead
   */
  updateLeadData(data: Partial<LeadData>): void {
    this.context.leadData = {
      ...this.context.leadData,
      ...data
    };
    console.log('[AgentState] Lead data actualizada:', this.context.leadData);
  }

  /**
   * Agregar interes del lead
   */
  addInterest(interest: string): void {
    if (!this.context.leadData.interest) {
      this.context.leadData.interest = [];
    }
    if (!this.context.leadData.interest.includes(interest)) {
      this.context.leadData.interest.push(interest);
    }
  }

  /**
   * Agregar pain point
   */
  addPainPoint(painPoint: string): void {
    if (!this.context.leadData.painPoints) {
      this.context.leadData.painPoints = [];
    }
    if (!this.context.leadData.painPoints.includes(painPoint)) {
      this.context.leadData.painPoints.push(painPoint);
    }
  }

  /**
   * Registrar objecion
   */
  addObjection(objection: string): void {
    if (!this.context.objections.includes(objection)) {
      this.context.objections.push(objection);
    }
  }

  /**
   * Actualizar ultimo tema
   */
  setLastTopic(topic: string): void {
    this.context.lastTopic = topic;
  }

  /**
   * Actualizar idioma
   */
  setLanguage(language: string): void {
    this.context.language = language;
  }

  /**
   * Marcar reunion agendada
   */
  markMeetingScheduled(calendarLink?: string): void {
    this.context.leadData.meetingScheduled = true;
    if (calendarLink) {
      this.context.leadData.calendarLink = calendarLink;
    }
  }

  /**
   * Extraer informacion del lead de un mensaje
   * Usa patrones para detectar nombre, empresa, telefono, email, etc.
   */
  extractLeadInfo(message: string): Partial<LeadData> {
    const extracted: Partial<LeadData> = {};
    const msgLower = message.toLowerCase();

    console.log('[AgentState] Extrayendo info de:', message.substring(0, 100));

    // Detectar nombre (patrones más flexibles)
    const namePatterns = [
      /(?:me llamo|soy|mi nombre es|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+)?)/i,
      /(?:my name is|i am|i'm|this is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
      // Nombres que empiezan la oración
      /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?)\s+(?:aqui|aquí|hablando|speaking)/i
    ];
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        extracted.name = match[1].trim();
        console.log('[AgentState] Nombre detectado:', extracted.name);
        break;
      }
    }

    // Detectar empresa
    const companyPatterns = [
      /(?:trabajo en|soy de|empresa|company|work at|work for|from)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]+)/i,
      /(?:de la empresa|de|del)\s+([A-Z][A-Za-zñáéíóú0-9\s]+)/i
    ];
    for (const pattern of companyPatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        extracted.company = match[1].trim();
        console.log('[AgentState] Empresa detectada:', extracted.company);
        break;
      }
    }

    // Detectar email
    const emailPattern = /[\w.-]+@[\w.-]+\.\w{2,}/;
    const emailMatch = message.match(emailPattern);
    if (emailMatch) {
      extracted.email = emailMatch[0].toLowerCase();
      console.log('[AgentState] Email detectado:', extracted.email);
    }

    // Detectar teléfono (varios formatos)
    const phonePatterns = [
      // Chile: +56 9 1234 5678 o 9 1234 5678
      /(?:\+?56\s?)?9\s?\d{4}\s?\d{4}/,
      // Formato internacional genérico
      /\+\d{1,3}\s?\d{6,12}/,
      // Formato con separadores
      /\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/,
      // Solo números (8-12 dígitos)
      /(?<!\d)\d{8,12}(?!\d)/
    ];
    for (const pattern of phonePatterns) {
      const phoneMatch = message.match(pattern);
      if (phoneMatch) {
        // Limpiar el teléfono (solo números y +)
        const cleanPhone = phoneMatch[0].replace(/[^\d+]/g, '');
        if (cleanPhone.length >= 8) {
          extracted.phone = cleanPhone;
          console.log('[AgentState] Teléfono detectado:', extracted.phone);
          break;
        }
      }
    }

    // Detectar intereses por keywords
    const interestKeywords: Record<string, string> = {
      'chatbot': 'development',
      'bot': 'development',
      'automatizar': 'automation',
      'automatización': 'automation',
      'automate': 'automation',
      'automation': 'automation',
      'dashboard': 'development',
      'predecir': 'development',
      'predicción': 'development',
      'predict': 'development',
      'estrategia': 'consulting',
      'strategy': 'consulting',
      'evaluar': 'consulting',
      'assess': 'consulting',
      'consultoría': 'consulting',
      'consultoria': 'consulting',
      'consulting': 'consulting',
      'rpa': 'automation',
      'proceso': 'automation',
      'procesos': 'automation',
      'process': 'automation',
      'machine learning': 'development',
      'ml': 'development',
      'inteligencia artificial': 'consulting',
      'ia': 'consulting',
      'ai': 'consulting',
      'reunión': 'meeting',
      'reunion': 'meeting',
      'cita': 'meeting',
      'agendar': 'meeting',
      'llamada': 'meeting',
      'meeting': 'meeting',
      'call': 'meeting'
    };

    const interests: string[] = [];
    for (const [keyword, service] of Object.entries(interestKeywords)) {
      if (msgLower.includes(keyword) && !interests.includes(service)) {
        interests.push(service);
      }
    }
    if (interests.length > 0) {
      extracted.interest = interests;
      console.log('[AgentState] Intereses detectados:', interests);
    }

    // Detectar pain points
    const painKeywords = [
      'problema', 'problem', 'issue', 'challenge', 'dificultad', 'difficulty',
      'lento', 'slow', 'costoso', 'expensive', 'manual', 'repetitivo', 'repetitive',
      'error', 'errors', 'tiempo', 'time', 'ineficiente', 'inefficient',
      'necesito', 'need', 'quiero', 'want', 'busco', 'looking for'
    ];
    const painPoints: string[] = [];
    for (const keyword of painKeywords) {
      if (msgLower.includes(keyword)) {
        // Extraer contexto alrededor del keyword
        const idx = msgLower.indexOf(keyword);
        const start = Math.max(0, idx - 20);
        const end = Math.min(message.length, idx + 30);
        const context = message.substring(start, end).trim();
        if (context && context.length > 5 && !painPoints.includes(context)) {
          painPoints.push(context);
        }
      }
    }
    if (painPoints.length > 0) {
      extracted.painPoints = painPoints.slice(0, 3);
      console.log('[AgentState] Pain points detectados:', painPoints.slice(0, 3));
    }

    // Log resumen de lo extraido
    const extractedKeys = Object.keys(extracted);
    if (extractedKeys.length > 0) {
      console.log('[AgentState] Datos extraídos:', extractedKeys.join(', '));
    } else {
      console.log('[AgentState] No se extrajo ningún dato del mensaje');
    }

    return extracted;
  }

  /**
   * Determinar si deberia transicionar a otra fase
   * basado en el contexto actual
   */
  suggestNextPhase(): ConversationPhase | null {
    const { phase, turnCount, leadData } = this.context;

    switch (phase) {
      case ConversationPhase.GREETING:
        if (turnCount >= 1) {
          return ConversationPhase.DISCOVERY;
        }
        break;

      case ConversationPhase.DISCOVERY:
        if (turnCount >= 3 && (leadData.interest?.length || leadData.painPoints?.length)) {
          return ConversationPhase.QUALIFICATION;
        }
        break;

      case ConversationPhase.QUALIFICATION:
        if (turnCount >= 5 || leadData.company || leadData.companySize) {
          return ConversationPhase.PRESENTATION;
        }
        break;

      case ConversationPhase.PRESENTATION:
        if (turnCount >= 7) {
          return ConversationPhase.BOOKING;
        }
        break;

      case ConversationPhase.OBJECTION_HANDLING:
        if (this.context.objections.length <= 2) {
          return ConversationPhase.BOOKING;
        }
        break;

      case ConversationPhase.BOOKING:
        if (leadData.meetingScheduled) {
          return ConversationPhase.FAREWELL;
        }
        break;
    }

    return null;
  }

  /**
   * Obtener instruccion para la fase actual
   */
  getPhaseInstruction(): string {
    return PHASE_INSTRUCTIONS[this.context.phase];
  }

  /**
   * Generar contexto para inyectar en el prompt del LLM
   */
  getContextForPrompt(): string {
    const { phase, turnCount, leadData, lastTopic, objections } = this.context;

    let contextStr = `\n## CONTEXTO ACTUAL\n`;
    contextStr += `- Fase: ${phase}\n`;
    contextStr += `- Turno: ${turnCount}\n`;

    if (leadData.name) {
      contextStr += `- Nombre del prospecto: ${leadData.name}\n`;
    }
    if (leadData.company) {
      contextStr += `- Empresa: ${leadData.company}\n`;
    }
    if (leadData.interest?.length) {
      contextStr += `- Intereses: ${leadData.interest.join(', ')}\n`;
    }
    if (leadData.painPoints?.length) {
      contextStr += `- Pain points: ${leadData.painPoints.join(', ')}\n`;
    }
    if (objections.length > 0) {
      contextStr += `- Objeciones: ${objections.join(', ')}\n`;
    }
    if (lastTopic) {
      contextStr += `- Ultimo tema: ${lastTopic}\n`;
    }

    contextStr += `\n## INSTRUCCION PARA ESTE TURNO\n`;
    contextStr += this.getPhaseInstruction();

    return contextStr;
  }

  /**
   * Serializar estado para persistencia
   */
  serialize(): string {
    return JSON.stringify(this.context);
  }

  /**
   * Deserializar estado
   */
  static deserialize(data: string): AgentStateTracker {
    const tracker = new AgentStateTracker();
    try {
      const parsed = JSON.parse(data) as ConversationContext;
      tracker.context = parsed;
    } catch (e) {
      console.error('[AgentState] Error deserializando:', e);
    }
    return tracker;
  }

  /**
   * Resetear estado
   */
  reset(language?: string): void {
    const now = Date.now();
    this.context = {
      phase: ConversationPhase.GREETING,
      turnCount: 0,
      leadData: {},
      objections: [],
      lastTopic: '',
      language: language || this.context.language,
      sessionStartTime: now,
      lastActivityTime: now
    };
  }
}
