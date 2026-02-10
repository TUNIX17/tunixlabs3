import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data'; // Necesitarás instalar 'form-data' si aún no está
import { requireProxyAuth, getClientIP } from '@/lib/auth';
import { proxyLimiter } from '@/lib/rateLimit';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

const ALLOWED_AUDIO_TYPES = [
  'audio/webm', 'audio/mp3', 'audio/wav', 'audio/mpeg',
  'audio/ogg', 'audio/flac', 'audio/m4a', 'audio/mp4',
  'audio/x-m4a', 'video/webm',
];

const ALLOWED_MODELS = [
  'whisper-large-v3',
  'whisper-large-v3-turbo',
  'distil-whisper-large-v3-en',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  console.log('[API Transcribe] Recibida solicitud de transcripcion');

  try {
    const authError = requireProxyAuth(request);
    if (authError) return authError;

    const ip = getClientIP(request);
    const rateCheck = proxyLimiter.check(ip);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!GROQ_API_KEY) {
      console.error("[API Transcribe] FATAL ERROR: La variable de entorno GROQ_API_KEY no está configurada en el servidor.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const incomingFormData = await request.formData();
    const file = incomingFormData.get('file') as File | null;
    const model = incomingFormData.get('model') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo de audio.' }, { status: 400 });
    }
    if (!model) {
      return NextResponse.json({ error: 'No se especificó el modelo de transcripción.' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 25MB.' }, { status: 413 });
    }

    // Validate file type
    if (file.type && !ALLOWED_AUDIO_TYPES.includes(file.type) && !file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Audio files only.' }, { status: 415 });
    }

    // Validate model against allowlist
    if (!ALLOWED_MODELS.includes(model)) {
      return NextResponse.json({ error: 'Invalid transcription model.' }, { status: 400 });
    }

    // Crear un nuevo FormData para enviar a Groq
    const groqFormData = new FormData();
    groqFormData.append('file', Buffer.from(await file.arrayBuffer()), file.name);
    groqFormData.append('model', model);
    groqFormData.append('response_format', 'verbose_json');

    console.log(`[API Transcribe] Enviando a Groq STT. Modelo: ${model}, Formato: verbose_json`);

    const response = await axios.post(`${GROQ_API_URL}/audio/transcriptions`, groqFormData, {
      headers: {
        ...groqFormData.getHeaders(),
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
    });

    // Reenviar las cabeceras de rate limit de Groq si existen
    const responseHeaders = new Headers();
    if (response.headers['retry-after']) responseHeaders.set('retry-after', response.headers['retry-after']);
    if (response.headers['x-ratelimit-limit-requests']) responseHeaders.set('x-ratelimit-limit-requests', response.headers['x-ratelimit-limit-requests']);
    if (response.headers['x-ratelimit-remaining-requests']) responseHeaders.set('x-ratelimit-remaining-requests', response.headers['x-ratelimit-remaining-requests']);
    if (response.headers['x-ratelimit-reset-requests']) responseHeaders.set('x-ratelimit-reset-requests', response.headers['x-ratelimit-reset-requests']);

    return NextResponse.json(response.data, { status: response.status, headers: responseHeaders });

  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { error?: unknown } }; message?: string };
    console.error('Error en el endpoint de transcripción de audio:', axiosError.response?.data || axiosError.message);
    const status = axiosError.response?.status || 500;

    // Generic error message - do not leak upstream details
    return NextResponse.json(
      { error: 'Error processing transcription' },
      { status }
    );
  }
}
