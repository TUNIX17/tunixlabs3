/**
 * Adaptive Voice Activity Detection (VAD)
 * Sistema de umbral dinámico que se adapta al ruido ambiente
 */

export interface AdaptiveVADState {
  noiseFloor: number;           // Estimación del nivel de ruido de fondo
  peakLevel: number;            // Nivel pico reciente
  adaptiveThreshold: number;    // Umbral calculado dinámicamente
  isCalibrated: boolean;        // Si ya completó la calibración inicial
  isSpeaking: boolean;          // Estado actual de detección con histéresis
}

export interface AdaptiveVADConfig {
  /** Habilitar modo adaptativo */
  enabled: boolean;
  /** Factor SNR (Signal-to-Noise Ratio) - umbral = noiseFloor * snrFactor */
  snrFactor: number;
  /** Tamaño del buffer de historial (muestras) */
  historySize: number;
  /** Valor de histéresis para evitar oscilaciones */
  hysteresis: number;
  /** Duración de calibración inicial (ms) */
  calibrationDurationMs: number;
  /** Percentil para calcular noise floor (0-1) */
  noisePercentile: number;
  /** Umbral mínimo permitido */
  minThreshold: number;
  /** Umbral máximo permitido */
  maxThreshold: number;
  /** Factor de olvido para noise floor (0-1, más alto = más lento) */
  noiseDecayFactor: number;
}

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveVADConfig = {
  enabled: true,
  snrFactor: 2.5,
  historySize: 100,          // ~5 segundos a 50ms interval
  hysteresis: 0.015,
  calibrationDurationMs: 2000,
  noisePercentile: 0.1,      // Percentil 10 para noise floor
  minThreshold: 0.04,
  maxThreshold: 0.25,
  noiseDecayFactor: 0.95
};

/**
 * Clase para manejo de VAD adaptativo
 * Implementa:
 * - Calibración automática del ruido ambiente
 * - Umbral dinámico basado en SNR
 * - Histéresis para estabilidad
 * - Buffer circular para historial
 */
export class AdaptiveVADProcessor {
  private config: AdaptiveVADConfig;
  private state: AdaptiveVADState;
  private historyBuffer: number[];
  private calibrationStartTime: number | null = null;
  private calibrationSamples: number[] = [];

  constructor(config: Partial<AdaptiveVADConfig> = {}) {
    this.config = { ...DEFAULT_ADAPTIVE_CONFIG, ...config };
    this.state = {
      noiseFloor: 0.08,           // Valor inicial conservador
      peakLevel: 0.08,
      adaptiveThreshold: 0.12,    // Igual al default fijo
      isCalibrated: false,
      isSpeaking: false
    };
    this.historyBuffer = [];
  }

  /**
   * Iniciar fase de calibración
   * Debe llamarse al inicio de cada sesión de escucha
   */
  startCalibration(): void {
    this.calibrationStartTime = Date.now();
    this.calibrationSamples = [];
    this.state.isCalibrated = false;
    console.log('[AdaptiveVAD] Iniciando calibración...');
  }

  /**
   * Verificar si la calibración está completa
   */
  isCalibrationComplete(): boolean {
    if (this.state.isCalibrated) return true;
    if (!this.calibrationStartTime) return false;

    const elapsed = Date.now() - this.calibrationStartTime;
    return elapsed >= this.config.calibrationDurationMs;
  }

  /**
   * Finalizar calibración y calcular noise floor inicial
   */
  finishCalibration(): void {
    if (this.calibrationSamples.length === 0) {
      console.warn('[AdaptiveVAD] No hay muestras de calibración, usando valores por defecto');
      this.state.isCalibrated = true;
      return;
    }

    // Calcular noise floor como percentil bajo de las muestras de calibración
    const sorted = [...this.calibrationSamples].sort((a, b) => a - b);
    const percentileIndex = Math.floor(sorted.length * 0.5); // Mediana durante calibración
    this.state.noiseFloor = sorted[percentileIndex] || 0.05;

    // Calcular umbral inicial
    this.state.adaptiveThreshold = this.calculateThreshold(this.state.noiseFloor);
    this.state.isCalibrated = true;

    console.log('[AdaptiveVAD] Calibración completa:', {
      noiseFloor: (this.state.noiseFloor * 100).toFixed(2) + '%',
      threshold: (this.state.adaptiveThreshold * 100).toFixed(2) + '%',
      samples: this.calibrationSamples.length
    });

    // Limpiar muestras de calibración
    this.calibrationSamples = [];
    this.calibrationStartTime = null;
  }

  /**
   * Procesar una nueva muestra de volumen
   * @param volume Volumen RMS normalizado (0-1)
   * @returns Objeto con threshold actual y si se detecta voz
   */
  processVolume(volume: number): {
    threshold: number;
    isVoice: boolean;
    noiseFloor: number;
    isCalibrating: boolean;
  } {
    // Fase de calibración
    if (!this.state.isCalibrated) {
      this.calibrationSamples.push(volume);

      if (this.isCalibrationComplete()) {
        this.finishCalibration();
      }

      return {
        threshold: this.state.adaptiveThreshold,
        isVoice: false, // No detectar voz durante calibración
        noiseFloor: this.state.noiseFloor,
        isCalibrating: true
      };
    }

    // Añadir al buffer de historial
    this.historyBuffer.push(volume);
    if (this.historyBuffer.length > this.config.historySize) {
      this.historyBuffer.shift();
    }

    // Actualizar noise floor de forma adaptativa
    this.updateNoiseFloor(volume);

    // Actualizar peak level
    if (volume > this.state.peakLevel) {
      this.state.peakLevel = volume;
    } else {
      // Decay lento del peak
      this.state.peakLevel = this.state.peakLevel * 0.99 + volume * 0.01;
    }

    // Calcular umbral dinámico
    this.state.adaptiveThreshold = this.calculateThreshold(this.state.noiseFloor);

    // Detección con histéresis
    const isVoice = this.detectWithHysteresis(volume);

    return {
      threshold: this.state.adaptiveThreshold,
      isVoice,
      noiseFloor: this.state.noiseFloor,
      isCalibrating: false
    };
  }

  /**
   * Actualizar estimación de noise floor usando moving minimum
   */
  private updateNoiseFloor(currentVolume: number): void {
    // Si el volumen actual es menor que el noise floor, actualizar rápido
    if (currentVolume < this.state.noiseFloor) {
      this.state.noiseFloor = currentVolume;
    } else {
      // Decay lento hacia arriba (permite adaptarse a cambios en ruido ambiente)
      this.state.noiseFloor =
        this.config.noiseDecayFactor * this.state.noiseFloor +
        (1 - this.config.noiseDecayFactor) * currentVolume;
    }

    // Recalcular periódicamente usando historial
    if (this.historyBuffer.length >= 20 && this.historyBuffer.length % 10 === 0) {
      const sorted = [...this.historyBuffer].sort((a, b) => a - b);
      const percentileIndex = Math.floor(sorted.length * this.config.noisePercentile);
      const historicalNoiseFloor = sorted[percentileIndex] || this.state.noiseFloor;

      // Blend entre estimación actual y histórica
      this.state.noiseFloor = this.state.noiseFloor * 0.7 + historicalNoiseFloor * 0.3;
    }
  }

  /**
   * Calcular umbral dinámico basado en SNR
   */
  private calculateThreshold(noiseFloor: number): number {
    const threshold = noiseFloor * this.config.snrFactor;

    // Clamp a valores razonables
    return Math.max(
      this.config.minThreshold,
      Math.min(this.config.maxThreshold, threshold)
    );
  }

  /**
   * Detectar voz con histéresis para evitar oscilaciones
   */
  private detectWithHysteresis(volume: number): boolean {
    const threshold = this.state.adaptiveThreshold;
    const hysteresis = this.config.hysteresis;

    if (!this.state.isSpeaking) {
      // Para activar, necesitamos superar threshold + hysteresis
      if (volume > threshold + hysteresis) {
        this.state.isSpeaking = true;
      }
    } else {
      // Para desactivar, necesitamos bajar de threshold - hysteresis
      if (volume < threshold - hysteresis) {
        this.state.isSpeaking = false;
      }
    }

    return this.state.isSpeaking;
  }

  /**
   * Obtener estado actual
   */
  getState(): AdaptiveVADState {
    return { ...this.state };
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig: Partial<AdaptiveVADConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Reset completo del procesador
   */
  reset(): void {
    this.state = {
      noiseFloor: 0.08,
      peakLevel: 0.08,
      adaptiveThreshold: 0.12,
      isCalibrated: false,
      isSpeaking: false
    };
    this.historyBuffer = [];
    this.calibrationStartTime = null;
    this.calibrationSamples = [];
  }

  /**
   * Forzar un nuevo noise floor (útil para testing)
   */
  setNoiseFloor(value: number): void {
    this.state.noiseFloor = Math.max(0.01, Math.min(0.5, value));
    this.state.adaptiveThreshold = this.calculateThreshold(this.state.noiseFloor);
  }
}

export default AdaptiveVADProcessor;
