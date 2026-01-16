/**
 * Voice Activity Detection (VAD) using Web Audio API
 * Detecta cuando el usuario esta hablando basado en umbral de volumen
 * Soporta modo adaptativo con calibración automática de ruido ambiente
 */

import { VADConfig, DEFAULT_VAD_CONFIG } from './vadConfig';
import { AdaptiveVADProcessor } from './adaptiveVAD';

/** Eventos emitidos por VAD */
export type VADEvent =
  | 'speech_start'        // Usuario empezo a hablar
  | 'speech_end'          // Usuario dejo de hablar (silencio detectado)
  | 'volume_change'       // Cambio en nivel de volumen
  | 'listening_start'     // VAD empezo a escuchar
  | 'listening_stop'      // VAD dejo de escuchar
  | 'calibration_start'   // Iniciando calibración de ruido
  | 'calibration_end'     // Calibración completada
  | 'threshold_update';   // Umbral adaptativo actualizado

/** Estado interno del VAD */
export interface VADState {
  isListening: boolean;        // VAD esta activo
  isSpeaking: boolean;         // Usuario esta hablando actualmente
  currentVolume: number;       // Nivel de volumen actual (0-1)
  speechStartTime: number | null;   // Timestamp cuando empezo a hablar
  lastSpeechTime: number | null;    // Ultimo timestamp con voz detectada
  // Estado del modo adaptativo
  isCalibrating: boolean;      // Si está en fase de calibración
  adaptiveThreshold: number;   // Umbral actual (adaptativo o fijo)
  noiseFloor: number;          // Nivel de ruido estimado
}

/** Callback para eventos VAD */
export type VADCallback = (data?: {
  volume?: number;
  duration?: number;
  threshold?: number;
  noiseFloor?: number;
}) => void;

/**
 * Clase principal de Voice Activity Detection
 * Usa Web Audio API para analizar volumen en tiempo real
 * Soporta modo adaptativo con calibración automática
 */
export class VoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private analysisInterval: ReturnType<typeof setInterval> | null = null;

  private config: VADConfig;
  private state: VADState;
  private callbacks: Map<VADEvent, Set<VADCallback>>;

  // Procesador adaptativo (opcional)
  private adaptiveProcessor: AdaptiveVADProcessor | null = null;

  // Timers para debounce
  private speechStartTimer: ReturnType<typeof setTimeout> | null = null;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;

  // Flag para tracking de estado de speech
  private pendingSpeechStart: boolean = false;

  // Debug: contador para logging periódico
  private analysisCount: number = 0;

  // Último umbral reportado (para evitar spam de eventos)
  private lastReportedThreshold: number = 0;

  constructor(config: Partial<VADConfig> = {}) {
    this.config = { ...DEFAULT_VAD_CONFIG, ...config };
    this.state = {
      isListening: false,
      isSpeaking: false,
      currentVolume: 0,
      speechStartTime: null,
      lastSpeechTime: null,
      isCalibrating: false,
      adaptiveThreshold: this.config.volumeThreshold,
      noiseFloor: 0.05
    };
    this.callbacks = new Map();

    // Inicializar procesador adaptativo si está habilitado
    if (this.config.adaptive?.enabled) {
      this.adaptiveProcessor = new AdaptiveVADProcessor(this.config.adaptive);
      console.log('[VAD] Modo adaptativo habilitado');
    }
  }

  /**
   * Iniciar VAD - solicita acceso al microfono y comienza analisis
   */
  async start(): Promise<void> {
    if (this.state.isListening) {
      console.warn('[VAD] Ya esta escuchando');
      return;
    }

    try {
      // Solicitar acceso al microfono
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Crear contexto de audio
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();

      // Configurar analyser para deteccion de volumen
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.3;

      // Conectar microfono al analyser
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      // Buffer para datos de frecuencia
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      // Iniciar calibración si modo adaptativo está habilitado
      if (this.adaptiveProcessor) {
        this.adaptiveProcessor.startCalibration();
        this.state.isCalibrating = true;
        this.emit('calibration_start');
        console.log('[VAD] Iniciando calibración de ruido ambiente...');
      }

      // Iniciar analisis periodico
      this.analysisInterval = setInterval(
        () => this.analyzeVolume(),
        this.config.analysisIntervalMs
      );

      this.state.isListening = true;
      this.analysisCount = 0; // Reset contador de debug
      this.emit('listening_start');

      const modeStr = this.adaptiveProcessor ? 'ADAPTATIVO' : 'FIJO';
      console.log(`[VAD] Iniciado en modo ${modeStr} con config:`, {
        threshold: this.config.volumeThreshold,
        adaptive: this.config.adaptive?.enabled
      });

    } catch (error) {
      console.error('[VAD] Error al iniciar:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Detener VAD - libera recursos
   */
  stop(): void {
    if (!this.state.isListening) {
      return;
    }

    // Si estaba hablando, emitir speech_end
    if (this.state.isSpeaking) {
      this.handleSpeechEnd();
    }

    this.cleanup();
    this.state.isListening = false;
    this.emit('listening_stop');

    console.log('[VAD] Detenido');
  }

  /**
   * Limpiar recursos
   */
  private cleanup(): void {
    // Limpiar timers
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }

    if (this.speechStartTimer) {
      clearTimeout(this.speechStartTimer);
      this.speechStartTimer = null;
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    // Desconectar nodos de audio
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    // Cerrar contexto de audio
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Detener tracks del microfono
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    this.analyser = null;
    this.dataArray = null;
    this.pendingSpeechStart = false;

    // Resetear procesador adaptativo
    if (this.adaptiveProcessor) {
      this.adaptiveProcessor.reset();
    }
    this.state.isCalibrating = false;
  }

  /**
   * Analizar volumen actual del audio
   */
  private analyzeVolume(): void {
    if (!this.analyser || !this.dataArray) {
      return;
    }

    // Obtener datos de frecuencia
    this.analyser.getByteFrequencyData(this.dataArray);

    // Calcular RMS (Root Mean Square) para obtener volumen
    const volume = this.calculateRMS(this.dataArray);

    // Actualizar estado
    const previousVolume = this.state.currentVolume;
    this.state.currentVolume = volume;

    // Variables para detección de voz
    let isVoiceDetected: boolean;
    let currentThreshold: number;

    // Usar procesador adaptativo si está disponible
    if (this.adaptiveProcessor) {
      const result = this.adaptiveProcessor.processVolume(volume);

      // Actualizar estado con valores adaptativos
      this.state.adaptiveThreshold = result.threshold;
      this.state.noiseFloor = result.noiseFloor;
      currentThreshold = result.threshold;

      // Manejar fin de calibración
      if (this.state.isCalibrating && !result.isCalibrating) {
        this.state.isCalibrating = false;
        this.emit('calibration_end', {
          threshold: result.threshold,
          noiseFloor: result.noiseFloor
        });
        console.log('[VAD] Calibración completada:', {
          threshold: (result.threshold * 100).toFixed(2) + '%',
          noiseFloor: (result.noiseFloor * 100).toFixed(2) + '%'
        });
      }

      // Emitir actualización de umbral si cambió significativamente
      if (Math.abs(result.threshold - this.lastReportedThreshold) > 0.005) {
        this.lastReportedThreshold = result.threshold;
        this.emit('threshold_update', {
          threshold: result.threshold,
          noiseFloor: result.noiseFloor
        });
      }

      // No detectar voz durante calibración
      isVoiceDetected = result.isCalibrating ? false : result.isVoice;
    } else {
      // Modo fijo: usar umbral configurado directamente
      currentThreshold = this.config.volumeThreshold;
      this.state.adaptiveThreshold = currentThreshold;
      isVoiceDetected = volume > currentThreshold;
    }

    // Debug: Log periódico de volumen (cada 1 segundo = 20 análisis a 50ms)
    this.analysisCount++;
    if (this.analysisCount % 20 === 0) {
      const status = this.state.isSpeaking ? 'SPEAKING' : (this.state.isCalibrating ? 'CALIBRATING' : 'SILENT');
      const modeStr = this.adaptiveProcessor ? 'ADAPT' : 'FIXED';
      console.log(`[VAD:${modeStr}] Vol: ${(volume * 100).toFixed(1)}% | Thr: ${(currentThreshold * 100).toFixed(1)}% | Noise: ${(this.state.noiseFloor * 100).toFixed(1)}% | ${status}`);
    }

    // Emitir cambio de volumen si es significativo
    if (Math.abs(volume - previousVolume) > 0.005) {
      this.emit('volume_change', { volume });
    }

    // No procesar voz durante calibración
    if (this.state.isCalibrating) {
      return;
    }

    if (isVoiceDetected) {
      this.handleVoiceDetected();
    } else {
      this.handleSilenceDetected();
    }
  }

  /**
   * Calcular RMS del array de frecuencias
   * Retorna valor normalizado 0-1
   */
  private calculateRMS(dataArray: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = dataArray[i] / 255;
      sum += normalized * normalized;
    }
    return Math.sqrt(sum / dataArray.length);
  }

  /**
   * Manejar deteccion de voz
   */
  private handleVoiceDetected(): void {
    const now = Date.now();
    this.state.lastSpeechTime = now;

    // Cancelar timer de silencio si existe
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    // Si ya esta hablando, no hacer nada mas
    if (this.state.isSpeaking) {
      return;
    }

    // Si ya hay un timer pendiente para iniciar speech, no crear otro
    if (this.pendingSpeechStart) {
      return;
    }

    // Iniciar timer de debounce para speech_start
    this.pendingSpeechStart = true;
    this.speechStartTimer = setTimeout(() => {
      // Verificar que aun hay voz despues del delay
      if (this.state.currentVolume > this.config.volumeThreshold) {
        this.handleSpeechStart();
      }
      this.pendingSpeechStart = false;
    }, this.config.speechStartDelay);
  }

  /**
   * Manejar deteccion de silencio
   */
  private handleSilenceDetected(): void {
    // Cancelar timer de speech start si existe
    if (this.speechStartTimer) {
      clearTimeout(this.speechStartTimer);
      this.speechStartTimer = null;
      this.pendingSpeechStart = false;
    }

    // Si no esta hablando, no hacer nada
    if (!this.state.isSpeaking) {
      return;
    }

    // Si ya hay un timer de silencio, no crear otro
    if (this.silenceTimer) {
      return;
    }

    // Iniciar timer de silencio
    this.silenceTimer = setTimeout(() => {
      // Verificar duracion minima de speech
      if (this.state.speechStartTime) {
        const speechDuration = Date.now() - this.state.speechStartTime;
        if (speechDuration >= this.config.minSpeechDuration) {
          this.handleSpeechEnd();
        } else {
          // Speech muy corto, ignorar
          console.log('[VAD] Speech ignorado - duracion muy corta:', speechDuration, 'ms');
          this.state.isSpeaking = false;
          this.state.speechStartTime = null;
        }
      }
      this.silenceTimer = null;
    }, this.config.silenceTimeout);
  }

  /**
   * Manejar inicio de speech
   */
  private handleSpeechStart(): void {
    if (this.state.isSpeaking) {
      return;
    }

    this.state.isSpeaking = true;
    this.state.speechStartTime = Date.now();

    console.log('[VAD] Speech detectado - inicio');
    this.emit('speech_start');
  }

  /**
   * Manejar fin de speech
   */
  private handleSpeechEnd(): void {
    if (!this.state.isSpeaking) {
      return;
    }

    const duration = this.state.speechStartTime
      ? Date.now() - this.state.speechStartTime
      : 0;

    this.state.isSpeaking = false;
    this.state.speechStartTime = null;

    console.log('[VAD] Speech terminado - duracion:', duration, 'ms');
    this.emit('speech_end', { duration });
  }

  /**
   * Ajustar umbral de volumen dinamicamente
   */
  setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      console.warn('[VAD] Threshold debe estar entre 0 y 1');
      return;
    }
    this.config.volumeThreshold = threshold;
    console.log('[VAD] Threshold actualizado a:', threshold);
  }

  /**
   * Obtener configuracion actual
   */
  getConfig(): VADConfig {
    return { ...this.config };
  }

  /**
   * Actualizar configuracion
   */
  updateConfig(newConfig: Partial<VADConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Actualizar procesador adaptativo si la config cambió
    if (newConfig.adaptive && this.adaptiveProcessor) {
      this.adaptiveProcessor.updateConfig(newConfig.adaptive);
    }

    // Habilitar/deshabilitar modo adaptativo dinámicamente
    if (newConfig.adaptive?.enabled !== undefined) {
      if (newConfig.adaptive.enabled && !this.adaptiveProcessor) {
        this.adaptiveProcessor = new AdaptiveVADProcessor(this.config.adaptive);
        console.log('[VAD] Modo adaptativo habilitado dinámicamente');
      } else if (!newConfig.adaptive.enabled && this.adaptiveProcessor) {
        this.adaptiveProcessor = null;
        this.state.isCalibrating = false;
        console.log('[VAD] Modo adaptativo deshabilitado');
      }
    }

    console.log('[VAD] Config actualizada:', this.config);
  }

  /**
   * Verificar si está en fase de calibración
   */
  isCalibrating(): boolean {
    return this.state.isCalibrating;
  }

  /**
   * Obtener el umbral actual (adaptativo o fijo)
   */
  getCurrentThreshold(): number {
    return this.state.adaptiveThreshold;
  }

  /**
   * Obtener el nivel de ruido estimado
   */
  getNoiseFloor(): number {
    return this.state.noiseFloor;
  }

  /**
   * Forzar recalibración del VAD adaptativo
   */
  recalibrate(): void {
    if (this.adaptiveProcessor && this.state.isListening) {
      this.adaptiveProcessor.startCalibration();
      this.state.isCalibrating = true;
      this.emit('calibration_start');
      console.log('[VAD] Recalibración iniciada');
    }
  }

  /**
   * Obtener estado actual
   */
  getState(): VADState {
    return { ...this.state };
  }

  /**
   * Registrar callback para evento
   */
  on(event: VADEvent, callback: VADCallback): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set());
    }
    this.callbacks.get(event)!.add(callback);
  }

  /**
   * Remover callback para evento
   */
  off(event: VADEvent, callback?: VADCallback): void {
    if (!this.callbacks.has(event)) {
      return;
    }

    if (callback) {
      this.callbacks.get(event)!.delete(callback);
    } else {
      // Remover todos los callbacks para este evento
      this.callbacks.delete(event);
    }
  }

  /**
   * Emitir evento
   */
  private emit(event: VADEvent, data?: {
    volume?: number;
    duration?: number;
    threshold?: number;
    noiseFloor?: number;
  }): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`[VAD] Error en callback para ${event}:`, error);
        }
      });
    }
  }

  /**
   * Verificar si el navegador soporta las APIs necesarias
   */
  static isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const hasMediaDevices = typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';
    const hasAudioContext = typeof AudioContext !== 'undefined' ||
      typeof (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext !== 'undefined';
    return hasMediaDevices && hasAudioContext;
  }

  /**
   * Destruir instancia y liberar todos los recursos
   */
  dispose(): void {
    this.stop();
    this.callbacks.clear();
  }
}

export default VoiceActivityDetector;
