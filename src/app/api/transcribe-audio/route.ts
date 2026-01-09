import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data'; // Necesitarás instalar 'form-data' si aún no está

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

export async function POST(request: NextRequest) {
  console.log('[API Transcribe] Recibida solicitud de transcripcion');

  if (!GROQ_API_KEY) {
    console.error("[API Transcribe] FATAL ERROR: La variable de entorno GROQ_API_KEY no está configurada en el servidor.");
    return NextResponse.json({ error: 'Error de configuración del servidor: GROQ_API_KEY no encontrada. Configura esta variable de entorno.' }, { status: 500 });
  }

  try {
    const incomingFormData = await request.formData();
    const file = incomingFormData.get('file') as File | null;
    const model = incomingFormData.get('model') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo de audio.' }, { status: 400 });
    }
    if (!model) {
      return NextResponse.json({ error: 'No se especificó el modelo de transcripción.' }, { status: 400 });
    }

    // Crear un nuevo FormData para enviar a Groq
    const groqFormData = new FormData();
    groqFormData.append('file', Buffer.from(await file.arrayBuffer()), file.name);
    groqFormData.append('model', model);
    // Aquí puedes añadir otros parámetros que acepte la API de transcripción de Groq, como 'language'
    // ej: groqFormData.append('language', 'es');
    groqFormData.append('response_format', 'verbose_json');

    console.log(`[API Transcribe] Enviando a Groq STT. Modelo: ${model}, Formato: verbose_json`); // Log para confirmar

    const response = await axios.post(`${GROQ_API_URL}/audio/transcriptions`, groqFormData, {
      headers: {
        ...groqFormData.getHeaders(), // Importante para 'multipart/form-data' con la librería 'form-data'
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
    });

    // Reenviar las cabeceras de rate limit de Groq si existen
    const responseHeaders = new Headers();
    if (response.headers['retry-after']) responseHeaders.set('retry-after', response.headers['retry-after']);
    if (response.headers['x-ratelimit-limit-requests']) responseHeaders.set('x-ratelimit-limit-requests', response.headers['x-ratelimit-limit-requests']);
    if (response.headers['x-ratelimit-remaining-requests']) responseHeaders.set('x-ratelimit-remaining-requests', response.headers['x-ratelimit-remaining-requests']);
    if (response.headers['x-ratelimit-reset-requests']) responseHeaders.set('x-ratelimit-reset-requests', response.headers['x-ratelimit-reset-requests']);
    // Añade más cabeceras de tokens si es necesario y si Groq las devuelve para este endpoint

    return NextResponse.json(response.data, { status: response.status, headers: responseHeaders });

  } catch (error: any) {
    console.error('Error en el endpoint de transcripción de audio:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { message: 'Error interno del servidor al procesar la transcripción.' };
    
    if (error.response?.data?.error) {
      return NextResponse.json({ error: error.response.data.error }, { status });
    }
    return NextResponse.json({ error: 'Error al procesar la transcripción.', details: errorData }, { status });
  }
} 