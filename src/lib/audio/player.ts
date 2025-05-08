// Interfaces para la reproducción de audio
export interface AudioPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoaded: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  errorMessage: string | null;
}

export interface AudioPlayerOptions {
  autoPlay?: boolean;
  volume?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onError?: (error: Error) => void;
}

export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private audioUrl: string | null = null;
  private options: AudioPlayerOptions;
  private state: AudioPlayerState = {
    isPlaying: false,
    isPaused: false,
    isLoaded: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    errorMessage: null
  };

  constructor(options: AudioPlayerOptions = {}) {
    this.options = {
      autoPlay: false,
      volume: 1,
      ...options
    };
    
    // Crear elemento de audio
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.volume = this.options.volume || 1;
      
      // Configurar eventos
      this.setupEventListeners();
    }
  }

  // Obtener el estado actual del reproductor
  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  // Cargar audio desde blob
  public loadFromBlob(blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audio) {
        reject(new Error('El reproductor de audio no está disponible'));
        return;
      }
      
      try {
        // Limpiar URL anterior si existe
        this.cleanupAudioUrl();
        
        // Crear URL del blob
        this.audioUrl = URL.createObjectURL(blob);
        this.audio.src = this.audioUrl;
        
        // Esperar a que el audio esté listo
        const handleCanPlay = () => {
          this.state = {
            ...this.state,
            isLoaded: true,
            duration: this.audio?.duration || 0
          };
          
          this.audio?.removeEventListener('canplay', handleCanPlay);
          
          if (this.options.autoPlay) {
            this.play().catch(reject);
          }
          
          resolve();
        };
        
        this.audio.addEventListener('canplay', handleCanPlay);
        
        // Manejar errores de carga
        const handleError = (e: Event) => {
          const errorMessage = 'Error al cargar el audio';
          this.state = {
            ...this.state,
            errorMessage
          };
          
          this.audio?.removeEventListener('error', handleError);
          reject(new Error(errorMessage));
        };
        
        this.audio.addEventListener('error', handleError);
      } catch (error) {
        this.state = {
          ...this.state,
          errorMessage: error instanceof Error ? error.message : 'Error desconocido al cargar audio'
        };
        reject(error);
      }
    });
  }

  // Reproducir audio
  public play(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audio || !this.state.isLoaded) {
        reject(new Error('No hay audio cargado para reproducir'));
        return;
      }
      
      try {
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.state = {
                ...this.state,
                isPlaying: true,
                isPaused: false
              };
              resolve();
            })
            .catch((error) => {
              this.state = {
                ...this.state,
                errorMessage: error instanceof Error ? error.message : 'Error al reproducir audio'
              };
              reject(error);
            });
        } else {
          // Para navegadores que no devuelven promesa
          this.state = {
            ...this.state,
            isPlaying: true,
            isPaused: false
          };
          resolve();
        }
      } catch (error) {
        this.state = {
          ...this.state,
          errorMessage: error instanceof Error ? error.message : 'Error al reproducir audio'
        };
        reject(error);
      }
    });
  }

  // Pausar reproducción
  public pause(): void {
    if (!this.audio || !this.state.isPlaying) {
      return;
    }
    
    try {
      this.audio.pause();
      this.state = {
        ...this.state,
        isPlaying: false,
        isPaused: true
      };
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error al pausar audio'
      };
      throw error;
    }
  }

  // Reanudar reproducción
  public resume(): Promise<void> {
    if (!this.state.isPaused) {
      return Promise.resolve();
    }
    
    return this.play();
  }

  // Detener reproducción
  public stop(): void {
    if (!this.audio) {
      return;
    }
    
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.state = {
        ...this.state,
        isPlaying: false,
        isPaused: false,
        currentTime: 0
      };
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error al detener audio'
      };
      throw error;
    }
  }

  // Ajustar volumen (0-1)
  public setVolume(volume: number): void {
    if (!this.audio) {
      return;
    }
    
    try {
      // Limitar volumen entre 0 y 1
      const newVolume = Math.max(0, Math.min(1, volume));
      this.audio.volume = newVolume;
      this.state = {
        ...this.state,
        volume: newVolume
      };
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error al ajustar volumen'
      };
      throw error;
    }
  }

  // Buscar a una posición específica (en segundos)
  public seek(time: number): void {
    if (!this.audio || !this.state.isLoaded) {
      return;
    }
    
    try {
      // Limitar tiempo entre 0 y duración
      const duration = this.audio.duration || 0;
      const newTime = Math.max(0, Math.min(duration, time));
      
      this.audio.currentTime = newTime;
      this.state = {
        ...this.state,
        currentTime: newTime
      };
    } catch (error) {
      this.state = {
        ...this.state,
        errorMessage: error instanceof Error ? error.message : 'Error al buscar posición'
      };
      throw error;
    }
  }

  // Limpiar recursos
  public dispose(): void {
    if (!this.audio) {
      return;
    }
    
    try {
      this.audio.pause();
      this.removeEventListeners();
      this.cleanupAudioUrl();
      
      this.audio = null;
      this.state = {
        isPlaying: false,
        isPaused: false,
        isLoaded: false,
        duration: 0,
        currentTime: 0,
        volume: 1,
        errorMessage: null
      };
    } catch (error) {
      console.error('Error al liberar recursos de audio:', error);
    }
  }

  // Configurar escuchadores de eventos
  private setupEventListeners(): void {
    if (!this.audio) {
      return;
    }
    
    this.audio.addEventListener('play', this.handlePlay);
    this.audio.addEventListener('pause', this.handlePause);
    this.audio.addEventListener('ended', this.handleEnded);
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.addEventListener('error', this.handleError);
  }

  // Eliminar escuchadores de eventos
  private removeEventListeners(): void {
    if (!this.audio) {
      return;
    }
    
    this.audio.removeEventListener('play', this.handlePlay);
    this.audio.removeEventListener('pause', this.handlePause);
    this.audio.removeEventListener('ended', this.handleEnded);
    this.audio.removeEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.removeEventListener('error', this.handleError);
  }

  // Limpiar URL del objeto blob
  private cleanupAudioUrl(): void {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
  }

  // Manejadores de eventos
  private handlePlay = (): void => {
    this.state = {
      ...this.state,
      isPlaying: true,
      isPaused: false
    };
    
    if (this.options.onPlay) {
      this.options.onPlay();
    }
  };

  private handlePause = (): void => {
    // No actualizar estado si se está terminando el audio
    if (this.audio && Math.abs(this.audio.currentTime - this.audio.duration) > 0.1) {
      this.state = {
        ...this.state,
        isPlaying: false,
        isPaused: true
      };
      
      if (this.options.onPause) {
        this.options.onPause();
      }
    }
  };

  private handleEnded = (): void => {
    this.state = {
      ...this.state,
      isPlaying: false,
      isPaused: false,
      currentTime: 0
    };
    
    if (this.options.onEnded) {
      this.options.onEnded();
    }
  };

  private handleTimeUpdate = (): void => {
    if (!this.audio) {
      return;
    }
    
    this.state = {
      ...this.state,
      currentTime: this.audio.currentTime
    };
    
    if (this.options.onTimeUpdate) {
      this.options.onTimeUpdate(this.audio.currentTime);
    }
  };

  private handleError = (e: Event): void => {
    const errorCode = this.audio?.error?.code || 0;
    let errorMessage = 'Error desconocido durante la reproducción';
    
    switch (errorCode) {
      case 1:
        errorMessage = 'Proceso de obtención de audio abortado';
        break;
      case 2:
        errorMessage = 'Error de red al obtener el audio';
        break;
      case 3:
        errorMessage = 'Error al decodificar el audio';
        break;
      case 4:
        errorMessage = 'Audio no soportado';
        break;
    }
    
    this.state = {
      ...this.state,
      errorMessage
    };
    
    if (this.options.onError) {
      this.options.onError(new Error(errorMessage));
    }
  };
} 