// Interfaces para gestionar el estado de la grabación
export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  audioBlob: Blob | null;
  duration: number;
  errorMessage: string | null;
}

export interface AudioRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  maxDurationMs?: number;
  onDataAvailable?: (blob: Blob) => void;
  onEnded?: () => void;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startTime: number = 0;
  private stopTime: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  private options: AudioRecorderOptions;
  private state: AudioRecorderState = {
    isRecording: false,
    isPaused: false,
    audioBlob: null,
    duration: 0,
    errorMessage: null
  };

  constructor(options: AudioRecorderOptions = {}) {
    this.options = {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 128000,
      maxDurationMs: 60000, // 1 minuto por defecto
      ...options
    };
  }

  // Obtener el estado actual de la grabación
  public getState(): AudioRecorderState {
    return { ...this.state };
  }

  // Iniciar la grabación de audio
  public async start(): Promise<void> {
    try {
      // Si ya está grabando, detener la grabación actual
      if (this.state.isRecording) {
        await this.stop();
      }

      // Solicitar acceso al micrófono
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configurar el MediaRecorder
      const options: MediaRecorderOptions = {
        mimeType: this.options.mimeType,
        audioBitsPerSecond: this.options.audioBitsPerSecond
      };
      
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.chunks = [];
      
      // Configurar los eventos
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data);
        }
        
        if (this.options.onDataAvailable) {
          this.options.onDataAvailable(e.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.chunks, { type: this.options.mimeType });
        this.stopTime = Date.now();
        
        this.state = {
          ...this.state,
          isRecording: false,
          isPaused: false,
          audioBlob,
          duration: this.calculateDuration()
        };
        
        if (this.options.onEnded) {
          this.options.onEnded();
        }
        
        // Liberar el micrófono
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      };
      
      // Iniciar grabación
      this.mediaRecorder.start(100); // Enviar datos cada 100ms
      this.startTime = Date.now();
      
      // Actualizar estado
      this.state = {
        ...this.state,
        isRecording: true,
        isPaused: false,
        errorMessage: null
      };
      
      // Configurar tiempo máximo de grabación
      if (this.options.maxDurationMs) {
        this.timeoutId = setTimeout(() => {
          if (this.state.isRecording) {
            this.stop();
          }
        }, this.options.maxDurationMs);
      }
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error desconocido al iniciar grabación'
      };
      throw error;
    }
  }

  // Pausar la grabación
  public pause(): void {
    if (!this.mediaRecorder || this.state.isPaused || !this.state.isRecording) {
      return;
    }
    
    try {
      this.mediaRecorder.pause();
      this.state = {
        ...this.state,
        isPaused: true
      };
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error al pausar grabación'
      };
      throw error;
    }
  }

  // Reanudar la grabación
  public resume(): void {
    if (!this.mediaRecorder || !this.state.isPaused || !this.state.isRecording) {
      return;
    }
    
    try {
      this.mediaRecorder.resume();
      this.state = {
        ...this.state,
        isPaused: false
      };
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error al reanudar grabación'
      };
      throw error;
    }
  }

  // Detener la grabación
  public stop(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.state.isRecording) {
        console.warn('[AudioRecorder] Se llamó a stop() pero no había grabación activa.');
        resolve(null);
        return;
      }
      
      try {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        
        const onStopHandler = () => {
          if (this.mediaRecorder) {
            this.mediaRecorder.removeEventListener('stop', onStopHandler);
          }
          setTimeout(() => {
            resolve(this.state.audioBlob);
          }, 10);
        };
        
        this.mediaRecorder.addEventListener('stop', onStopHandler);
        this.mediaRecorder.stop();

      } catch (error) {
        this.state = {
          ...this.state,
          errorMessage: error instanceof Error ? error.message : 'Error al detener grabación'
        };
        console.error('[AudioRecorder] Error interno al intentar detener:', error);
        resolve(null);
      }
    });
  }

  // Cancelar la grabación sin generar blob
  public cancel(): void {
    if (!this.mediaRecorder || !this.state.isRecording) {
      return;
    }
    
    try {
      // Limpiar el timeout si existe
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      
      // Detener el MediaRecorder sin procesar datos
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.stop();
      
      // Liberar micrófono
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      
      // Restablecer estado
      this.state = {
        isRecording: false,
        isPaused: false,
        audioBlob: null,
        duration: 0,
        errorMessage: null
      };
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error al cancelar grabación'
      };
      throw error;
    }
  }

  // Calcular la duración de la grabación
  private calculateDuration(): number {
    return this.stopTime - this.startTime;
  }
} 