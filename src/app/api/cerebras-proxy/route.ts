import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1';

interface ProxyRequestBody {
  endpoint: string;
  payload: unknown;
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
}

export async function POST(request: NextRequest) {
  if (!CEREBRAS_API_KEY) {
    console.error("FATAL ERROR: La variable de entorno CEREBRAS_API_KEY no está configurada en el servidor.");
    return NextResponse.json(
      { error: 'Error de configuración del servidor: clave API de Cerebras no encontrada.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json() as ProxyRequestBody;
    const { endpoint, payload, method = 'POST' } = body;

    // Lista blanca de endpoints permitidos
    const allowedEndpoints = ['/chat/completions', '/models'];
    if (!allowedEndpoints.includes(endpoint)) {
      return NextResponse.json(
        { error: 'Endpoint no permitido a través del proxy de Cerebras.' },
        { status: 403 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosConfig: any = {
      method: method,
      url: `${CEREBRAS_API_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' || method === 'PUT') {
      axiosConfig.data = payload;
    } else if (method === 'GET' && payload) {
      axiosConfig.params = payload;
    }

    const cerebrasResponse = await axios(axiosConfig);

    // Crear headers de respuesta incluyendo rate limit info si está disponible
    const responseHeaders = new Headers();

    // Propagar headers de rate limit de Cerebras si existen
    const rateLimitHeaders = [
      'x-ratelimit-limit-requests',
      'x-ratelimit-limit-tokens',
      'x-ratelimit-remaining-requests',
      'x-ratelimit-remaining-tokens',
      'x-ratelimit-reset-requests',
      'x-ratelimit-reset-tokens'
    ];

    rateLimitHeaders.forEach(header => {
      const value = cerebrasResponse.headers[header];
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    return NextResponse.json(cerebrasResponse.data, {
      status: cerebrasResponse.status,
      headers: responseHeaders
    });

  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { error?: unknown }; headers?: Record<string, string> }; message?: string };
    console.error('Error en el proxy a Cerebras:', axiosError.response?.data || axiosError.message);

    const status = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data || { message: 'Error interno del servidor al procesar la solicitud a Cerebras.' };

    // Propagar retry-after si existe (para rate limiting)
    const responseHeaders = new Headers();
    const retryAfter = axiosError.response?.headers?.['retry-after'];
    if (retryAfter) {
      responseHeaders.set('retry-after', retryAfter);
    }

    // Si el error viene de Cerebras con una estructura específica, la reenviamos
    if (axiosError.response?.data?.error) {
      return NextResponse.json(
        { error: axiosError.response.data.error },
        { status, headers: responseHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar la solicitud a Cerebras.', details: errorData },
      { status, headers: responseHeaders }
    );
  }
}
