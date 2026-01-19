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

/** Language detection entry for tracking */
export interface LanguageDetection {
  language: string;
  confidence: number;
  turnNumber: number;
  timestamp: number;
}

/** Configuration for language confirmation */
export interface LanguageConfirmationConfig {
  /** Number of consecutive turns required to confirm language switch */
  requiredConsecutiveTurns: number;
  /** Minimum confidence threshold to consider a detection */
  minConfidenceThreshold: number;
  /** Whether language confirmation is enabled */
  enabled: boolean;
}

/** Default language confirmation config */
export const DEFAULT_LANGUAGE_CONFIRMATION_CONFIG: LanguageConfirmationConfig = {
  requiredConsecutiveTurns: 2, // 2-3 turns before switching
  minConfidenceThreshold: 0.7,
  enabled: false // Controlled by feature flag
};

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
  // Language confirmation tracking
  languageHistory: LanguageDetection[];
  confirmedLanguage: string;
  pendingLanguageSwitch: string | null;
  languageSwitchTurnCount: number;
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
  private languageConfig: LanguageConfirmationConfig;

  constructor(language: string = 'es', languageConfig?: Partial<LanguageConfirmationConfig>) {
    const now = Date.now();
    this.languageConfig = {
      ...DEFAULT_LANGUAGE_CONFIRMATION_CONFIG,
      ...languageConfig
    };
    this.context = {
      phase: ConversationPhase.GREETING,
      turnCount: 0,
      leadData: {},
      objections: [],
      lastTopic: '',
      language,
      sessionStartTime: now,
      lastActivityTime: now,
      // Language confirmation tracking
      languageHistory: [],
      confirmedLanguage: language,
      pendingLanguageSwitch: null,
      languageSwitchTurnCount: 0
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
   * Add a language detection to history
   * Used for tracking detected languages over multiple turns
   */
  addLanguageDetection(language: string, confidence: number = 1.0): void {
    const detection: LanguageDetection = {
      language,
      confidence,
      turnNumber: this.context.turnCount,
      timestamp: Date.now()
    };

    this.context.languageHistory.push(detection);

    // Keep only last 10 detections to prevent memory growth
    if (this.context.languageHistory.length > 10) {
      this.context.languageHistory.shift();
    }

    console.log('[AgentState] Language detection added:', detection);
  }

  /**
   * Determine if we should switch to a detected language
   * Returns true only if the language has been consistently detected for N turns
   */
  shouldSwitchLanguage(detectedLanguage: string): boolean {
    // If language confirmation is disabled, always allow immediate switch
    if (!this.languageConfig.enabled) {
      return true;
    }

    const currentLang = this.context.confirmedLanguage;

    // If detected language matches current confirmed language, no switch needed
    if (detectedLanguage === currentLang) {
      this.context.pendingLanguageSwitch = null;
      this.context.languageSwitchTurnCount = 0;
      return false;
    }

    // Check if this is a continuation of a pending switch
    if (this.context.pendingLanguageSwitch === detectedLanguage) {
      this.context.languageSwitchTurnCount++;
      console.log(`[AgentState] Language switch pending: ${detectedLanguage}, turn ${this.context.languageSwitchTurnCount}/${this.languageConfig.requiredConsecutiveTurns}`);

      // Check if we've reached the threshold
      if (this.context.languageSwitchTurnCount >= this.languageConfig.requiredConsecutiveTurns) {
        console.log(`[AgentState] Language switch CONFIRMED after ${this.context.languageSwitchTurnCount} turns: ${currentLang} -> ${detectedLanguage}`);
        return true;
      }
    } else {
      // New language detected, start tracking
      this.context.pendingLanguageSwitch = detectedLanguage;
      this.context.languageSwitchTurnCount = 1;
      console.log(`[AgentState] New language detected: ${detectedLanguage}, starting confirmation countdown`);
    }

    return false;
  }

  /**
   * Confirm the pending language switch
   * Should be called after shouldSwitchLanguage returns true
   */
  confirmLanguageSwitch(): void {
    if (this.context.pendingLanguageSwitch) {
      const oldLang = this.context.confirmedLanguage;
      const newLang = this.context.pendingLanguageSwitch;

      this.context.confirmedLanguage = newLang;
      this.context.language = newLang;
      this.context.pendingLanguageSwitch = null;
      this.context.languageSwitchTurnCount = 0;

      console.log(`[AgentState] Language switch completed: ${oldLang} -> ${newLang}`);
    }
  }

  /**
   * Get the confirmed language (stable language after confirmation)
   */
  getConfirmedLanguage(): string {
    return this.context.confirmedLanguage;
  }

  /**
   * Get pending language switch info
   */
  getPendingLanguageSwitch(): { language: string | null; turnCount: number; required: number } {
    return {
      language: this.context.pendingLanguageSwitch,
      turnCount: this.context.languageSwitchTurnCount,
      required: this.languageConfig.requiredConsecutiveTurns
    };
  }

  /**
   * Update language confirmation config
   */
  setLanguageConfirmationConfig(config: Partial<LanguageConfirmationConfig>): void {
    this.languageConfig = {
      ...this.languageConfig,
      ...config
    };
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

    // Detectar intereses por keywords - Actualizado 2025
    const interestKeywords: Record<string, string> = {
      // Development
      'chatbot': 'development',
      'bot': 'development',
      'dashboard': 'development',
      'predecir': 'development',
      'predicción': 'development',
      'predict': 'development',
      'machine learning': 'development',
      'ml': 'development',
      'deep learning': 'development',
      'vision': 'development',
      'computer vision': 'development',
      'nlp': 'development',
      'voice agent': 'development',
      'agente de voz': 'development',
      'asistente virtual': 'development',
      'virtual assistant': 'development',
      'recomendacion': 'development',
      'recommendation': 'development',
      // Automation
      'automatizar': 'automation',
      'automatización': 'automation',
      'automate': 'automation',
      'automation': 'automation',
      'rpa': 'automation',
      'proceso': 'automation',
      'procesos': 'automation',
      'process': 'automation',
      'workflow': 'automation',
      'documento': 'automation',
      'documents': 'automation',
      'extraccion': 'automation',
      'extraction': 'automation',
      'ocr': 'automation',
      'agentes autonomos': 'automation',
      'autonomous agents': 'automation',
      'agentic': 'automation',
      // Consulting
      'estrategia': 'consulting',
      'strategy': 'consulting',
      'evaluar': 'consulting',
      'assess': 'consulting',
      'consultoría': 'consulting',
      'consultoria': 'consulting',
      'consulting': 'consulting',
      'roadmap': 'consulting',
      'madurez': 'consulting',
      'maturity': 'consulting',
      'transformacion digital': 'consulting',
      'digital transformation': 'consulting',
      'inteligencia artificial': 'consulting',
      'ia': 'consulting',
      'ai': 'consulting',
      // Generative AI (nuevo servicio 2025)
      'ia generativa': 'generative',
      'generative ai': 'generative',
      'llm': 'generative',
      'gpt': 'generative',
      'chatgpt': 'generative',
      'claude': 'generative',
      'contenido': 'generative',
      'content': 'generative',
      'generar': 'generative',
      'generate': 'generative',
      'rag': 'generative',
      'modelo de lenguaje': 'generative',
      'language model': 'generative',
      // Meeting intent
      'reunión': 'meeting',
      'reunion': 'meeting',
      'cita': 'meeting',
      'agendar': 'meeting',
      'llamada': 'meeting',
      'meeting': 'meeting',
      'call': 'meeting',
      'schedule': 'meeting'
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
    const newLanguage = language || this.context.language;
    this.context = {
      phase: ConversationPhase.GREETING,
      turnCount: 0,
      leadData: {},
      objections: [],
      lastTopic: '',
      language: newLanguage,
      sessionStartTime: now,
      lastActivityTime: now,
      // Reset language confirmation tracking
      languageHistory: [],
      confirmedLanguage: newLanguage,
      pendingLanguageSwitch: null,
      languageSwitchTurnCount: 0
    };
  }

  /**
   * Generar resumen de la conversacion para mensajes de contacto
   * Usado para WhatsApp y descripcion de citas
   */
  generateConversationSummary(): string {
    const { leadData, lastTopic } = this.context;
    const parts: string[] = [];

    // Nombre si lo tenemos
    if (leadData.name) {
      parts.push(`Soy ${leadData.name}`);
    }

    // Empresa si la tenemos
    if (leadData.company) {
      parts.push(`de ${leadData.company}`);
    }

    // Intereses detectados
    if (leadData.interest && leadData.interest.length > 0) {
      const interestMap: Record<string, string> = {
        'consulting': 'consultoria en IA',
        'development': 'desarrollo de software con IA',
        'automation': 'automatizacion inteligente',
        'generative': 'IA generativa',
        'meeting': 'agendar una reunion'
      };
      const interestNames = leadData.interest
        .map(i => interestMap[i] || i)
        .filter(Boolean);
      if (interestNames.length > 0) {
        parts.push(`Me interesa: ${interestNames.join(', ')}`);
      }
    }

    // Pain points si los tenemos
    if (leadData.painPoints && leadData.painPoints.length > 0) {
      const painSummary = leadData.painPoints.slice(0, 2).join(', ');
      parts.push(`Necesidad: ${painSummary}`);
    }

    // Ultimo tema si tenemos
    if (lastTopic && !parts.some(p => p.includes(lastTopic))) {
      parts.push(`Tema: ${lastTopic}`);
    }

    // Si no hay datos, mensaje generico
    if (parts.length === 0) {
      return 'Me gustaria conocer mas sobre los servicios de TunixLabs.';
    }

    return parts.join('. ') + '.';
  }

  /**
   * Generar mensaje completo para WhatsApp
   */
  generateWhatsAppMessage(): string {
    const summary = this.generateConversationSummary();
    return `Hola Alejandro! Acabo de hablar con Tunix en tu web. ${summary}`;
  }

  /**
   * Generar descripcion para cita de Calendly
   */
  generateMeetingDescription(): string {
    const { leadData } = this.context;
    const parts: string[] = [];

    if (leadData.name) parts.push(`Contacto: ${leadData.name}`);
    if (leadData.company) parts.push(`Empresa: ${leadData.company}`);
    if (leadData.email) parts.push(`Email: ${leadData.email}`);
    if (leadData.phone) parts.push(`Telefono: ${leadData.phone}`);

    const summary = this.generateConversationSummary();
    parts.push(`\nResumen: ${summary}`);

    return parts.join('\n');
  }
}
