// Idiomas soportados en formato ISO 639-1
export const SUPPORTED_LANGUAGES = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ar: 'العربية',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
  nl: 'Nederlands',
  pl: 'Polski',
  tr: 'Türkçe'
};

// Tipo para el resultado del detector de idioma
export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
  supportedLanguage: boolean;
}

// Frases comunes para detectar idiomas específicos
const LANGUAGE_MARKERS: Record<string, string[]> = {
  es: ['hola', 'buenos días', 'gracias', 'por favor', 'ayuda', 'como', 'qué', 'cómo'],
  en: ['hello', 'good morning', 'thank you', 'please', 'help', 'how', 'what', 'excuse me'],
  fr: ['bonjour', 'merci', 's\'il vous plaît', 'aide', 'comment', 'quoi', 'excusez-moi'],
  de: ['hallo', 'guten morgen', 'danke', 'bitte', 'hilfe', 'wie', 'was', 'entschuldigung'],
  it: ['ciao', 'buongiorno', 'grazie', 'per favore', 'aiuto', 'come', 'cosa', 'scusa'],
  pt: ['olá', 'bom dia', 'obrigado', 'por favor', 'ajuda', 'como', 'o que', 'desculpe']
};

export class LanguageDetector {
  private defaultLanguage: string = 'es';
  private browserLanguage: string | null = null;

  constructor() {
    // Detectar idioma del navegador si estamos en el cliente
    if (typeof window !== 'undefined') {
      this.browserLanguage = this.getBrowserLanguage();
    }
  }

  // Método principal para detectar idioma desde texto
  public detectLanguage(text: string): LanguageDetectionResult {
    // Normalizar texto para comparación
    const normalizedText = text.toLowerCase().trim();
    
    if (!normalizedText) {
      // Texto vacío, usar idioma del navegador o valor por defecto
      return this.getFallbackLanguage();
    }
    
    // 1. Buscar marcadores lingüísticos específicos
    const markerResult = this.detectByMarkers(normalizedText);
    if (markerResult.confidence > 0.7) {
      return markerResult;
    }
    
    // 2. Analizar características del texto (caracteres, patrones)
    const characterResult = this.detectByCharacteristics(normalizedText);
    if (characterResult.confidence > 0.8) {
      return characterResult;
    }
    
    // 3. Intentar detección usando estadísticas de N-gramas
    // Implementación básica, para producción usaríamos una biblioteca especializada
    const ngramResult = this.detectByNgrams(normalizedText);
    if (ngramResult.confidence > 0.6) {
      return ngramResult;
    }
    
    // Si no podemos determinar con confianza, usar idioma del navegador
    return this.getFallbackLanguage();
  }

  // Actualizar idioma por defecto
  public setDefaultLanguage(languageCode: string): void {
    if (this.isLanguageSupported(languageCode)) {
      this.defaultLanguage = languageCode;
    } else {
      console.warn(`Idioma no soportado: ${languageCode}. Usando idioma por defecto: ${this.defaultLanguage}`);
    }
  }

  // Verificar si un idioma está soportado
  public isLanguageSupported(languageCode: string): boolean {
    return Object.keys(SUPPORTED_LANGUAGES).includes(languageCode);
  }

  // Obtener todos los idiomas soportados
  public getSupportedLanguages(): Record<string, string> {
    return { ...SUPPORTED_LANGUAGES };
  }

  // Método auxiliar para obtener el idioma del navegador
  private getBrowserLanguage(): string {
    let browserLang = navigator.language || (navigator as any).userLanguage;
    
    // Extraer código de idioma principal (ej: 'es-ES' -> 'es')
    if (browserLang) {
      browserLang = browserLang.split('-')[0].toLowerCase();
      
      // Verificar si el idioma está soportado
      if (this.isLanguageSupported(browserLang)) {
        return browserLang;
      }
    }
    
    return this.defaultLanguage;
  }

  // Método para detectar idioma basado en marcadores específicos
  private detectByMarkers(text: string): LanguageDetectionResult {
    let bestMatch = '';
    let bestScore = 0;
    
    Object.entries(LANGUAGE_MARKERS).forEach(([lang, markers]) => {
      let matches = 0;
      
      markers.forEach(marker => {
        if (text.includes(marker)) {
          matches++;
        }
      });
      
      const score = matches / markers.length;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = lang;
      }
    });
    
    // Convertir puntuación a nivel de confianza (0-1)
    const confidence = bestScore > 0 ? Math.min(bestScore * 1.5, 1) : 0;
    
    return {
      detectedLanguage: bestMatch || this.defaultLanguage,
      confidence,
      supportedLanguage: !!bestMatch
    };
  }

  // Método para detectar idioma basado en características del texto
  private detectByCharacteristics(text: string): LanguageDetectionResult {
    // Detectar idiomas basados en caracteres específicos
    
    // Chino simplificado/tradicional
    if (/[\u4e00-\u9fff]/.test(text)) {
      return {
        detectedLanguage: 'zh',
        confidence: 0.95,
        supportedLanguage: true
      };
    }
    
    // Japonés (incluye Kanji, Hiragana y Katakana)
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) {
      return {
        detectedLanguage: 'ja',
        confidence: 0.9,
        supportedLanguage: true
      };
    }
    
    // Coreano
    if (/[\uac00-\ud7af\u1100-\u11ff]/.test(text)) {
      return {
        detectedLanguage: 'ko',
        confidence: 0.9,
        supportedLanguage: true
      };
    }
    
    // Árabe
    if (/[\u0600-\u06ff]/.test(text)) {
      return {
        detectedLanguage: 'ar',
        confidence: 0.9,
        supportedLanguage: true
      };
    }
    
    // Ruso y otros idiomas cirílicos
    if (/[\u0400-\u04ff]/.test(text)) {
      return {
        detectedLanguage: 'ru',
        confidence: 0.8, // Menos específico porque varios idiomas usan el cirílico
        supportedLanguage: true
      };
    }
    
    // Características específicas de idiomas latinos
    
    // Español (ñ, á, é, í, ó, ú, ü, ¿, ¡)
    if (/[ñáéíóúü¿¡]/.test(text)) {
      return {
        detectedLanguage: 'es',
        confidence: 0.8,
        supportedLanguage: true
      };
    }
    
    // Alemán (ä, ö, ü, ß)
    if (/[äöüß]/.test(text)) {
      return {
        detectedLanguage: 'de',
        confidence: 0.8,
        supportedLanguage: true
      };
    }
    
    // Francés (é, è, ê, à, ç, ù, û, ô, ï, ë)
    if (/[éèêàçùûôïë]/.test(text)) {
      return {
        detectedLanguage: 'fr',
        confidence: 0.7, // Menor porque puede confundirse con otros idiomas románicos
        supportedLanguage: true
      };
    }
    
    // Italiano (à, ì, ò, ù, è, é)
    if (/[àìòùèé]/.test(text)) {
      return {
        detectedLanguage: 'it',
        confidence: 0.6, // Menor por posible confusión con francés
        supportedLanguage: true
      };
    }
    
    // Si no hay características distintivas
    return {
      detectedLanguage: '',
      confidence: 0,
      supportedLanguage: false
    };
  }

  // Método para detectar idioma usando n-gramas
  // Esta es una implementación muy básica; en producción usaríamos una biblioteca especializada
  private detectByNgrams(text: string): LanguageDetectionResult {
    // Implementación simplificada para fines de demostración
    // En una aplicación real, usaríamos una biblioteca como franc o langdetect
    
    // Convertimos a idioma por defecto o navegador como fallback
    return this.getFallbackLanguage();
  }

  // Obtener idioma predeterminado basado en el navegador o configuración
  private getFallbackLanguage(): LanguageDetectionResult {
    const language = this.browserLanguage || this.defaultLanguage;
    return {
      detectedLanguage: language,
      confidence: 0.5,
      supportedLanguage: this.isLanguageSupported(language)
    };
  }
} 