/**
 * Validador de Transcripciones
 * Detecta transcripciones incoherentes del STT para pedir que repitan
 */

/**
 * Palabras comunes en español que el STT debería reconocer correctamente
 */
const COMMON_SPANISH_WORDS = new Set([
  'hola', 'que', 'como', 'bien', 'si', 'no', 'gracias', 'por', 'favor',
  'bueno', 'claro', 'ojalá', 'ojala', 'vale', 'ok', 'okay', 'entiendo',
  'quiero', 'necesito', 'puedo', 'tengo', 'hay', 'es', 'soy', 'estoy',
  'me', 'te', 'se', 'le', 'lo', 'la', 'los', 'las', 'un', 'una',
  'el', 'ella', 'nosotros', 'ustedes', 'ellos', 'mi', 'tu', 'su',
  'pero', 'porque', 'cuando', 'donde', 'como', 'cual', 'quien',
  'muy', 'mas', 'menos', 'mucho', 'poco', 'todo', 'nada', 'algo',
  'ahora', 'luego', 'despues', 'antes', 'siempre', 'nunca',
  'aqui', 'ahi', 'alli', 'cerca', 'lejos', 'arriba', 'abajo',
  'empresa', 'negocio', 'trabajo', 'proyecto', 'sistema', 'datos',
  'ayuda', 'información', 'informacion', 'servicio', 'consulta',
  'automatizar', 'inteligencia', 'artificial', 'chatbot', 'robot',
  'reunión', 'reunion', 'llamada', 'cita', 'agendar', 'contacto',
  'precio', 'costo', 'presupuesto', 'tiempo', 'semana', 'mes',
  'nombre', 'email', 'correo', 'teléfono', 'telefono', 'número', 'numero'
]);

/**
 * Palabras comunes en inglés que el STT debería reconocer
 */
const COMMON_ENGLISH_WORDS = new Set([
  'hello', 'hi', 'hey', 'what', 'how', 'good', 'yes', 'no', 'thanks',
  'please', 'okay', 'ok', 'sure', 'understand', 'want', 'need', 'can',
  'have', 'there', 'is', 'am', 'are', 'me', 'you', 'he', 'she', 'we',
  'they', 'my', 'your', 'his', 'her', 'our', 'their', 'but', 'because',
  'when', 'where', 'how', 'which', 'who', 'very', 'more', 'less', 'much',
  'little', 'all', 'nothing', 'something', 'now', 'later', 'after', 'before',
  'always', 'never', 'here', 'there', 'near', 'far', 'up', 'down',
  'company', 'business', 'work', 'project', 'system', 'data', 'help',
  'information', 'service', 'consulting', 'automate', 'intelligence',
  'artificial', 'chatbot', 'robot', 'meeting', 'call', 'schedule',
  'contact', 'price', 'cost', 'budget', 'time', 'week', 'month',
  'name', 'email', 'phone', 'number'
]);

/**
 * Palabras/frases que indican posible mal-transcripción
 * Estas son palabras en otros idiomas que suelen aparecer cuando el STT
 * no entiende correctamente el español/inglés
 */
const SUSPICIOUS_PATTERNS = [
  // Palabras francesas comunes que aparecen por error
  /\bpour\b/i, /\bfin\b/i, /\bje\b/i, /\btu\b/i, /\bvous\b/i,
  /\bmerci\b/i, /\bau revoir\b/i, /\bbonjour\b/i, /\bc'est\b/i,
  /\bqu['']est/i, /\bcomment\b/i, /\bqu[oi]?\b/i,

  // Palabras alemanas
  /\bdas\b/i, /\bist\b/i, /\bich\b/i, /\bdu\b/i, /\bwir\b/i,
  /\bdanke\b/i, /\bbitte\b/i, /\bauf wiedersehen\b/i,

  // Palabras portuguesas que difieren del español
  /\bobrigad[oa]\b/i, /\bvocê\b/i, /\bestá\b/i,

  // Palabras italianas
  /\bciao\b/i, /\bgrazie\b/i, /\bprego\b/i, /\bcome\b/i,

  // Patrones que indican transcripción corrupta
  /\bO['']?Hala\b/i, /\bWhat['']?s\s+up\b/i,
  /[A-Z]{3,}/,  // Varias mayúsculas seguidas (posible error de OCR-like)

  // Nombres propios extraños que pueden indicar mal-transcripción
  /\bO['']?[A-Z][a-z]+\s*\?/i  // Patrón como "O'Hala?"
];

/**
 * Patrones que indican mezcla de idiomas problemática
 */
const LANGUAGE_MIX_PATTERNS = [
  // Francés + Inglés (como "pour fin. What's up")
  { first: /\b(pour|merci|bonjour|au revoir|je|tu|vous)\b/i, second: /\b(what|how|yes|no|please|thanks|hello)\b/i },
  // Alemán + Inglés
  { first: /\b(danke|bitte|ich|du|wir)\b/i, second: /\b(what|how|yes|no|please|thanks|hello)\b/i },
  // Italiano + Inglés
  { first: /\b(ciao|grazie|prego)\b/i, second: /\b(what|how|yes|no|please|thanks|hello)\b/i }
];

export interface TranscriptionValidationResult {
  isValid: boolean;
  confidence: number;  // 0-1, donde 1 es muy confiable
  reason?: string;
  detectedIssues: string[];
  suggestedAction: 'process' | 'ask_repeat' | 'ignore';
}

/**
 * Valida si una transcripción parece coherente o si el STT cometió errores
 *
 * @param text - Texto transcrito por el STT
 * @param expectedLanguage - Idioma esperado ('es' o 'en')
 * @returns Resultado de validación con confianza y sugerencia de acción
 */
export function validateTranscription(
  text: string,
  expectedLanguage: string = 'es'
): TranscriptionValidationResult {
  const issues: string[] = [];
  let confidence = 1.0;

  // Limpiar y normalizar texto
  const cleanText = text.trim().toLowerCase();
  const words = cleanText.split(/\s+/).filter(w => w.length > 1);

  // Si el texto está vacío o es muy corto
  if (!cleanText || cleanText.length < 2) {
    return {
      isValid: false,
      confidence: 0,
      reason: 'Texto vacío o demasiado corto',
      detectedIssues: ['empty_or_too_short'],
      suggestedAction: 'ignore'
    };
  }

  // Si el texto es extremadamente corto (1-2 palabras muy cortas)
  if (words.length <= 2 && cleanText.length < 8) {
    // Verificar si son palabras válidas en el idioma esperado
    const validWordCount = countValidWords(words, expectedLanguage);
    if (validWordCount < words.length) {
      confidence -= 0.3;
      issues.push('very_short_unclear');
    }
  }

  // Detectar patrones sospechosos de mal-transcripción
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(text)) {
      confidence -= 0.25;
      issues.push(`suspicious_pattern: ${pattern.source}`);
    }
  }

  // Detectar mezcla problemática de idiomas
  for (const mix of LANGUAGE_MIX_PATTERNS) {
    if (mix.first.test(text) && mix.second.test(text)) {
      confidence -= 0.4;
      issues.push('problematic_language_mix');
    }
  }

  // Verificar proporción de palabras reconocibles en el idioma esperado
  if (words.length >= 3) {
    const validWords = countValidWords(words, expectedLanguage);
    const validRatio = validWords / words.length;

    if (validRatio < 0.3) {
      confidence -= 0.3;
      issues.push(`low_valid_word_ratio: ${(validRatio * 100).toFixed(0)}%`);
    } else if (validRatio < 0.5) {
      confidence -= 0.15;
      issues.push(`moderate_valid_word_ratio: ${(validRatio * 100).toFixed(0)}%`);
    }
  }

  // Detectar caracteres extraños o no-alfanuméricos excesivos
  const alphanumericRatio = (text.replace(/[^a-záéíóúüñ\s]/gi, '').length) / text.length;
  if (alphanumericRatio < 0.7) {
    confidence -= 0.2;
    issues.push('excessive_special_characters');
  }

  // Detectar preguntas con estructura extraña
  if (text.includes('?') && /[A-Z][a-z]+\s*\?/.test(text)) {
    // Nombres propios seguidos de signos de interrogación (como "O'Hala?")
    if (!/^(qué|que|cómo|como|cuándo|cuando|dónde|donde|quién|quien|what|how|when|where|who)/i.test(text)) {
      confidence -= 0.2;
      issues.push('unusual_question_structure');
    }
  }

  // Normalizar confianza entre 0 y 1
  confidence = Math.max(0, Math.min(1, confidence));

  // Determinar acción sugerida
  let suggestedAction: 'process' | 'ask_repeat' | 'ignore';
  let isValid = true;
  let reason: string | undefined;

  if (confidence >= 0.7) {
    suggestedAction = 'process';
  } else if (confidence >= 0.3) {
    suggestedAction = 'ask_repeat';
    isValid = false;
    reason = 'La transcripción parece incoherente o mezclada. Se recomienda pedir que repita.';
  } else {
    suggestedAction = 'ignore';
    isValid = false;
    reason = 'La transcripción es muy poco confiable.';
  }

  return {
    isValid,
    confidence,
    reason,
    detectedIssues: issues,
    suggestedAction
  };
}

/**
 * Cuenta palabras válidas en el idioma esperado
 */
function countValidWords(words: string[], language: string): number {
  const wordSet = language === 'en' ? COMMON_ENGLISH_WORDS : COMMON_SPANISH_WORDS;
  // También contar palabras del otro idioma como válidas (bilingüe es OK)
  const otherSet = language === 'en' ? COMMON_SPANISH_WORDS : COMMON_ENGLISH_WORDS;

  return words.filter(word => {
    const cleanWord = word.replace(/[.,!?;:'"]/g, '').toLowerCase();
    return wordSet.has(cleanWord) || otherSet.has(cleanWord) || cleanWord.length <= 2;
  }).length;
}

/**
 * Verifica rápidamente si una transcripción necesita validación extra
 * Útil para un check rápido antes de procesamiento completo
 */
export function needsValidation(text: string): boolean {
  if (!text || text.length < 3) return true;

  // Check rápido de patrones sospechosos
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(text)) return true;
  }

  // Check de mezcla de idiomas
  for (const mix of LANGUAGE_MIX_PATTERNS) {
    if (mix.first.test(text) && mix.second.test(text)) return true;
  }

  return false;
}

/**
 * Genera un mensaje para pedir que repitan basado en el idioma
 */
export function getRepeatRequestMessage(language: string = 'es'): string {
  const messages: Record<string, string> = {
    es: 'Disculpa, no te entendí bien. ¿Podrías repetirlo por favor?',
    en: 'Sorry, I didn\'t quite catch that. Could you please repeat?'
  };

  return messages[language] || messages.es;
}
