/**
 * Voice Activity Detection (VAD) Configuration
 * Configuraciones para deteccion de actividad de voz
 */

export interface VADConfig {
  /** Umbral de volumen (0-1) - audio por encima es considerado voz */
  volumeThreshold: number;

  /** Delay antes de confirmar inicio de voz (ms) - debounce */
  speechStartDelay: number;

  /** Tiempo de silencio para considerar fin de frase (ms) */
  silenceTimeout: number;

  /** Duracion minima de voz para ser valida (ms) - filtra clicks/ruidos */
  minSpeechDuration: number;

  /** Intervalo de analisis de volumen (ms) */
  analysisIntervalMs: number;
}

/** Configuracion por defecto - ambiente normal */
export const DEFAULT_VAD_CONFIG: VADConfig = {
  volumeThreshold: 0.12,       // 12% - umbral más alto para evitar falsos positivos por ruido de fondo
  speechStartDelay: 350,       // 350ms - debounce mayor para evitar activaciones por ruido
  silenceTimeout: 1200,        // 1.2s - pausa natural
  minSpeechDuration: 600,      // 600ms - filtra ruidos cortos con más rigor
  analysisIntervalMs: 50       // 50ms - analisis suave
};

/** Configuracion para ambientes ruidosos */
export const NOISY_VAD_CONFIG: VADConfig = {
  volumeThreshold: 0.12,       // 12% - umbral mas alto para filtrar ruido
  speechStartDelay: 350,       // 350ms - mas debounce
  silenceTimeout: 1500,        // 1.5s - mas tolerancia
  minSpeechDuration: 600,      // 600ms - mas estricto
  analysisIntervalMs: 50
};

/** Configuracion para ambientes muy silenciosos */
export const QUIET_VAD_CONFIG: VADConfig = {
  volumeThreshold: 0.008,      // 0.8% - muy sensible
  speechStartDelay: 150,       // 150ms - respuesta muy rapida
  silenceTimeout: 1200,        // 1.2s - pausa mas corta
  minSpeechDuration: 400,      // 400ms
  analysisIntervalMs: 50
};

/** Configuracion para barge-in (durante TTS) */
export const BARGEIN_VAD_CONFIG: VADConfig = {
  volumeThreshold: 0.10,       // 10% - umbral alto para evitar que TTS se auto-interrumpa
  speechStartDelay: 200,       // 200ms - respuesta rapida para interrumpir
  silenceTimeout: 800,         // 0.8s - mas corto para barge-in
  minSpeechDuration: 400,      // 400ms - permitir interrupciones claras
  analysisIntervalMs: 40       // 40ms - analisis frecuente
};

/** Presets disponibles */
export type VADPreset = 'default' | 'noisy' | 'quiet' | 'bargein';

export const VAD_PRESETS: Record<VADPreset, VADConfig> = {
  default: DEFAULT_VAD_CONFIG,
  noisy: NOISY_VAD_CONFIG,
  quiet: QUIET_VAD_CONFIG,
  bargein: BARGEIN_VAD_CONFIG
};

/**
 * Obtener configuracion VAD por preset
 */
export const getVADConfig = (preset: VADPreset = 'default'): VADConfig => {
  return { ...VAD_PRESETS[preset] };
};

/**
 * Crear configuracion personalizada basada en un preset
 */
export const createVADConfig = (
  preset: VADPreset = 'default',
  overrides?: Partial<VADConfig>
): VADConfig => {
  return {
    ...VAD_PRESETS[preset],
    ...overrides
  };
};
