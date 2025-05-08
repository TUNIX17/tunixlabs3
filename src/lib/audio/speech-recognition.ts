import axios from 'axios'; // Importar axios directamente

// Interfaces para el reconocimiento de voz
export interface SpeechRecognitionResult {
  text: string;
  language?: string;
  confidence?: number;
}

export interface SpeechRecognitionOptions {
  model?: string;
  language?: string; // Código ISO del idioma preferido (opcional)
  prompt?: string;   // Contexto para mejorar el reconocimiento
  temperature?: number;
}

// Clase para el reconocimiento de voz
export class SpeechRecognitionService {
  private defaultOptions: SpeechRecognitionOptions = {
    model: 'whisper-large-v3-turbo', // Modelo rápido por defecto
    language: 'auto',                // Detección automática
    prompt: '',                     // Sin contexto por defecto
    temperature: 0.0                // Valor por defecto para maximizar precisión
  };

  constructor(private options: SpeechRecognitionOptions = {}) {
    this.options = {
      ...this.defaultOptions,
      ...options
    };
  }

  // Métodos para cambiar opciones
  public setModel(model: string): void {
    this.options.model = model;
  }

  public setLanguage(language: string): void {
    this.options.language = language;
  }

  public setPrompt(prompt: string): void {
    this.options.prompt = prompt;
  }

  public setTemperature(temperature: number): void {
    // Limitar temperatura entre 0 y 1
    this.options.temperature = Math.max(0, Math.min(1, temperature));
  }

  // Método principal: reconocer voz desde un archivo de audio
  public async recognizeAudio(audioBlob: Blob): Promise<SpeechRecognitionResult> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav'); // o el nombre/tipo de archivo correcto
      formData.append('model', this.options.model || this.defaultOptions.model!);
      
      if (this.options.language && this.options.language !== 'auto') {
        formData.append('language', this.options.language);
      }
      if (this.options.prompt) {
        formData.append('prompt', this.options.prompt);
      }
      if (this.options.temperature !== this.defaultOptions.temperature) {
        formData.append('temperature', this.options.temperature!.toString());
      }
      
      const response = await axios.post<SpeechRecognitionResult>('/api/transcribe-audio', formData);
      return response.data;

    } catch (error: any) { // Tipar error como any para la comprobación estructural
      console.error('Error en reconocimiento de voz (API):', error);
      // Comprobación estructural para errores de Axios o similares con 'response'
      if (error && error.response && error.response.data && error.response.status) {
        const errorData = error.response.data;
        const status = error.response.status;
        const message = errorData?.error?.message || errorData?.message || error.message || 'Error de API de transcripción desconocido';
        throw new Error(`Error de API de transcripción (${status}): ${message}`);
      }
      throw new Error('Error al procesar el audio para reconocimiento de voz vía API');
    }
  }

  // Método auxiliar para reconocimiento local (fallback)
  public async recognizeAudioLocally(audioBlob: Blob): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('El reconocimiento de voz no está soportado en este navegador'));
        return;
      }
      
      try {
        // Crear elemento de audio para reproducir el blob
        const audio = new Audio();
        const audioUrl = URL.createObjectURL(audioBlob);
        audio.src = audioUrl;
        
        // Inicializar reconocimiento de voz
        // @ts-ignore - Ignora error de tipo para SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // Configurar reconocimiento
        if (this.options.language && this.options.language !== 'auto') {
          recognition.lang = this.options.language;
        }
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        // Manejar resultados
        recognition.onresult = (event: any) => {
          const result = event.results[0][0];
          resolve({
            text: result.transcript,
            confidence: result.confidence
          });
          
          // Limpiar recursos
          audio.pause();
          URL.revokeObjectURL(audioUrl);
          recognition.stop();
        };
        
        // Manejar errores
        recognition.onerror = (event: any) => {
          reject(new Error(`Error en reconocimiento local: ${event.error}`));
          
          // Limpiar recursos
          audio.pause();
          URL.revokeObjectURL(audioUrl);
        };
        
        // Iniciar reconocimiento cuando comience la reproducción
        audio.onplay = () => {
          recognition.start();
        };
        
        // Iniciar reproducción del audio
        audio.play().catch(err => {
          reject(new Error(`Error al reproducir audio para reconocimiento local: ${err.message}`));
          URL.revokeObjectURL(audioUrl);
        });
      } catch (error) {
        reject(new Error(`Error en reconocimiento local: ${error instanceof Error ? error.message : 'Error desconocido'}`));
      }
    });
  }
} 