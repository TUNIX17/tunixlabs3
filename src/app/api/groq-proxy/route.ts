import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { requireProxyAuth, getClientIP } from '@/lib/auth';
import { GroqProxySchema } from '@/lib/validation/schemas';
import { proxyLimiter } from '@/lib/rateLimit';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

export async function POST(request: NextRequest) {
  try {
    const authError = requireProxyAuth(request);
    if (authError) return authError;

    const ip = getClientIP(request);
    const rateCheck = proxyLimiter.check(ip);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!GROQ_API_KEY) {
      console.error("FATAL ERROR: La variable de entorno GROQ_API_KEY no está configurada en el servidor.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await request.json();
    const parseResult = GroqProxySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { endpoint, payload, method, responseType } = parseResult.data;

    // Cap max_tokens if present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safePayload = { ...payload } as Record<string, any>;
    if (safePayload?.max_tokens && safePayload.max_tokens > 2000) {
      safePayload.max_tokens = 2000;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosConfig: any = {
      method: method,
      url: `${GROQ_API_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: responseType,
    };

    if (method === 'POST') {
      axiosConfig.data = safePayload;
    } else if (method === 'GET' && safePayload) {
      axiosConfig.params = safePayload;
    }

    const groqResponse = await axios(axiosConfig);

    if (responseType === 'arraybuffer' && endpoint === '/audio/speech') {
      // Para audio, devolver el buffer con el content-type correcto
      const headers = new Headers();
      headers.set('Content-Type', groqResponse.headers['content-type'] || 'audio/mpeg');
      return new NextResponse(groqResponse.data as ArrayBuffer, { status: 200, statusText: 'OK', headers });
    }

    return NextResponse.json(groqResponse.data, { status: groqResponse.status });

  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { error?: unknown } }; message?: string };
    console.error('Error en el proxy a Groq:', axiosError.response?.data || axiosError.message);
    const status = axiosError.response?.status || 500;

    // Generic error message - do not leak upstream details
    return NextResponse.json(
      { error: 'Error processing Groq request' },
      { status }
    );
  }
}
