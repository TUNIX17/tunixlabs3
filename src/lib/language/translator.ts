import { SUPPORTED_LANGUAGES } from './detector';

// Traducciones de los mensajes del sistema
export const SYSTEM_MESSAGES: Record<string, Record<string, string>> = {
  // Mensajes para la interfaz de voz
  'voice.start_recording': {
    es: 'Haga clic para comenzar a grabar',
    en: 'Click to start recording',
    fr: 'Cliquez pour commencer l\'enregistrement',
    de: 'Klicken Sie, um die Aufnahme zu starten',
    it: 'Fare clic per avviare la registrazione',
    pt: 'Clique para iniciar a gravação',
    ar: 'انقر لبدء التسجيل',
    zh: '点击开始录制',
    ja: 'クリックして録音を開始',
    ko: '녹음을 시작하려면 클릭하세요',
    ru: 'Нажмите, чтобы начать запись',
    nl: 'Klik om opname te starten',
    pl: 'Kliknij, aby rozpocząć nagrywanie',
    tr: 'Kayda başlamak için tıklayın'
  },
  'voice.stop_recording': {
    es: 'Haga clic para detener la grabación',
    en: 'Click to stop recording',
    fr: 'Cliquez pour arrêter l\'enregistrement',
    de: 'Klicken Sie, um die Aufnahme zu beenden',
    it: 'Fare clic per interrompere la registrazione',
    pt: 'Clique para parar a gravação',
    ar: 'انقر لإيقاف التسجيل',
    zh: '点击停止录制',
    ja: 'クリックして録音を停止',
    ko: '녹음을 중지하려면 클릭하세요',
    ru: 'Нажмите, чтобы остановить запись',
    nl: 'Klik om opname te stoppen',
    pl: 'Kliknij, aby zatrzymać nagrywanie',
    tr: 'Kaydı durdurmak için tıklayın'
  },
  'voice.processing': {
    es: 'Procesando...',
    en: 'Processing...',
    fr: 'Traitement en cours...',
    de: 'Verarbeitung...',
    it: 'Elaborazione in corso...',
    pt: 'Processando...',
    ar: 'جاري المعالجة...',
    zh: '处理中...',
    ja: '処理中...',
    ko: '처리 중...',
    ru: 'Обработка...',
    nl: 'Verwerken...',
    pl: 'Przetwarzanie...',
    tr: 'İşleniyor...'
  },
  'voice.error.microphone_access': {
    es: 'No se puede acceder al micrófono',
    en: 'Cannot access microphone',
    fr: 'Impossible d\'accéder au microphone',
    de: 'Kein Zugriff auf das Mikrofon',
    it: 'Impossibile accedere al microfono',
    pt: 'Não é possível acessar o microfone',
    ar: 'لا يمكن الوصول إلى الميكروفون',
    zh: '无法访问麦克风',
    ja: 'マイクにアクセスできません',
    ko: '마이크에 액세스할 수 없습니다',
    ru: 'Нет доступа к микрофону',
    nl: 'Geen toegang tot microfoon',
    pl: 'Brak dostępu do mikrofonu',
    tr: 'Mikrofona erişilemiyor'
  },
  'voice.error.speech_recognition': {
    es: 'Error en el reconocimiento de voz',
    en: 'Speech recognition error',
    fr: 'Erreur de reconnaissance vocale',
    de: 'Fehler bei der Spracherkennung',
    it: 'Errore di riconoscimento vocale',
    pt: 'Erro de reconhecimento de fala',
    ar: 'خطأ في التعرف على الكلام',
    zh: '语音识别错误',
    ja: '音声認識エラー',
    ko: '음성 인식 오류',
    ru: 'Ошибка распознавания речи',
    nl: 'Spraakherkenfout',
    pl: 'Błąd rozpoznawania mowy',
    tr: 'Konuşma tanıma hatası'
  },
  'voice.error.network': {
    es: 'Error de red. Intente nuevamente',
    en: 'Network error. Please try again',
    fr: 'Erreur réseau. Veuillez réessayer',
    de: 'Netzwerkfehler. Bitte versuchen Sie es erneut',
    it: 'Errore di rete. Riprova',
    pt: 'Erro de rede. Tente novamente',
    ar: 'خطأ في الشبكة. حاول مرة أخرى',
    zh: '网络错误。请再试一次',
    ja: 'ネットワークエラー。もう一度お試しください',
    ko: '네트워크 오류. 다시 시도하십시오',
    ru: 'Ошибка сети. Пожалуйста, попробуйте еще раз',
    nl: 'Netwerkfout. Probeer het opnieuw',
    pl: 'Błąd sieci. Proszę spróbuj ponownie',
    tr: 'Ağ hatası. Lütfen tekrar deneyin'
  },
  'voice.input_placeholder': {
    es: 'Escribe tu mensaje aquí...',
    en: 'Type your message here...',
    fr: 'Tapez votre message ici...',
    de: 'Geben Sie hier Ihre Nachricht ein...',
    pt: 'Digite sua mensagem aqui...',
  },
  'voice.send': {
    es: 'Enviar',
    en: 'Send',
    fr: 'Envoyer',
    de: 'Senden',
    pt: 'Enviar',
  },
  
  // Mensajes específicos del robot
  'robot.greeting': {
    es: 'Hola, soy Tunix. ¿En qué puedo ayudarte?',
    en: 'Hello, I\'m Tunix. How can I help you?',
    fr: 'Bonjour, je suis Tunix. Comment puis-je vous aider ?',
    de: 'Hallo, ich bin Tunix. Wie kann ich Ihnen helfen?',
    it: 'Ciao, sono Tunix. Come posso aiutarti?',
    pt: 'Olá, sou Tunix. Como posso ajudar?',
    ar: 'مرحبًا ، أنا تونيكس. كيف يمكنني مساعدتك؟',
    zh: '你好，我是Tunix。我能帮你什么？',
    ja: 'こんにちは、Tunixです。どのようにお手伝いできますか？',
    ko: '안녕하세요, 저는 Tunix입니다. 어떻게 도와드릴까요?',
    ru: 'Привет, я Tunix. Чем я могу вам помочь?',
    nl: 'Hallo, ik ben Tunix. Hoe kan ik je helpen?',
    pl: 'Cześć, jestem Tunix. Jak mogę ci pomóc?',
    tr: 'Merhaba, ben Tunix. Size nasıl yardımcı olabilirim?'
  },
  'robot.thinking': {
    es: 'Estoy pensando...',
    en: 'I\'m thinking...',
    fr: 'Je réfléchis...',
    de: 'Ich denke nach...',
    it: 'Sto pensando...',
    pt: 'Estou pensando...',
    ar: 'أنا أفكر...',
    zh: '我在思考...',
    ja: '考え中...',
    ko: '생각 중...',
    ru: 'Я думаю...',
    nl: 'Ik denk na...',
    pl: 'Myślę...',
    tr: 'Düşünüyorum...'
  },
  'robot.error': {
    es: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
    en: 'I\'m sorry, an error occurred. Please try again.',
    fr: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
    de: 'Es tut mir leid, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    it: 'Mi dispiace, si è verificato un errore. Riprova.',
    pt: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
    ar: 'عذرًا ، حدث خطأ. الرجاء معاودة المحاولة.',
    zh: '抱歉，发生了错误。请再试一次。',
    ja: '申し訳ありませんが、エラーが発生しました。もう一度お試しください。',
    ko: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.',
    ru: 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.',
    nl: 'Het spijt me, er is een fout opgetreden. Probeer het opnieuw.',
    pl: 'Przepraszam, wystąpił błąd. Proszę spróbuj ponownie.',
    tr: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
  },
  'robot.too_many_requests': {
    es: 'Demasiadas solicitudes. Por favor, espera un momento.',
    en: 'Too many requests. Please wait a moment.',
    fr: 'Trop de demandes. Veuillez patienter un instant.',
    de: 'Zu viele Anfragen. Bitte warten Sie einen Moment.',
    it: 'Troppe richieste. Attendi un momento.',
    pt: 'Muitas solicitações. Aguarde um momento.',
    ar: 'طلبات كثيرة جدًا. يرجى الانتظار لحظة.',
    zh: '请求过多。请稍等片刻。',
    ja: 'リクエストが多すぎます。少々お待ちください。',
    ko: '요청이 너무 많습니다. 잠시만 기다려주세요.',
    ru: 'Слишком много запросов. Пожалуйста, подождите.',
    nl: 'Te veel verzoeken. Even geduld.',
    pl: 'Zbyt wiele żądań. Proszę chwilę poczekać.',
    tr: 'Çok fazla istek. Lütfen bir an bekleyin.'
  }
};

export class Translator {
  private defaultLanguage: string = 'es';

  constructor(defaultLanguage: string = 'es') {
    if (Object.keys(SUPPORTED_LANGUAGES).includes(defaultLanguage)) {
      this.defaultLanguage = defaultLanguage;
    }
  }

  // Traducir un mensaje del sistema
  public translate(key: string, language: string = this.defaultLanguage): string {
    // Verificar si el idioma está soportado
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(language)) {
      language = this.defaultLanguage;
    }
    
    // Buscar el mensaje por clave
    const messageSet = SYSTEM_MESSAGES[key];
    
    if (!messageSet) {
      console.warn(`Mensaje no encontrado para la clave: ${key}`);
      return key;
    }
    
    // Obtener traducción en el idioma solicitado
    const translation = messageSet[language];
    
    // Si no existe traducción para el idioma solicitado, usar idioma por defecto
    if (!translation) {
      console.warn(`Traducción no encontrada para el idioma ${language} y clave ${key}`);
      return messageSet[this.defaultLanguage] || key;
    }
    
    return translation;
  }

  // Cambiar idioma por defecto
  public setDefaultLanguage(language: string): void {
    if (Object.keys(SUPPORTED_LANGUAGES).includes(language)) {
      this.defaultLanguage = language;
    } else {
      console.warn(`Idioma no soportado: ${language}. Se mantiene el idioma por defecto: ${this.defaultLanguage}`);
    }
  }

  // Obtener el idioma por defecto actual
  public getDefaultLanguage(): string {
    return this.defaultLanguage;
  }

  // Obtener todos los idiomas soportados
  public getSupportedLanguages(): Record<string, string> {
    return { ...SUPPORTED_LANGUAGES };
  }

  // Verificar si un idioma está soportado
  public isLanguageSupported(language: string): boolean {
    return Object.keys(SUPPORTED_LANGUAGES).includes(language);
  }

  // Obtener todas las traducciones para una clave específica
  public getAllTranslations(key: string): Record<string, string> {
    const messageSet = SYSTEM_MESSAGES[key];
    
    if (!messageSet) {
      console.warn(`Mensaje no encontrado para la clave: ${key}`);
      return {};
    }
    
    return { ...messageSet };
  }
} 