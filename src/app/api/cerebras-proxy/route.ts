import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { requireProxyAuth, getClientIP } from '@/lib/auth';
import { CerebrasProxySchema } from '@/lib/validation/schemas';
import { proxyLimiter } from '@/lib/rateLimit';

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1';

export async function POST(request: NextRequest) {
  console.log('[API Cerebras] Recibida solicitud');

  // Auth check
  const authError = requireProxyAuth(request);
  if (authError) return authError;

  // Rate limiting
  const ip = getClientIP(request);
  const rateCheck = proxyLimiter.check(ip);
  if (!rateCheck.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  if (!CEREBRAS_API_KEY) {
    console.error("[API Cerebras] FATAL ERROR: La variable de entorno CEREBRAS_API_KEY no está configurada en el servidor.");
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const parseResult = CerebrasProxySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { endpoint, payload, method } = parseResult.data;

    console.log('[API Cerebras] Endpoint:', endpoint, ', Method:', method);

    // Cap max_tokens if present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safePayload = { ...payload } as Record<string, any>;
    if (safePayload?.max_tokens && safePayload.max_tokens > 2000) {
      safePayload.max_tokens = 2000;
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

    if (method === 'POST') {
      axiosConfig.data = safePayload;
    } else if (method === 'GET' && safePayload) {
      axiosConfig.params = safePayload;
    }

    const cerebrasResponse = await axios(axiosConfig);
    console.log('[API Cerebras] Respuesta recibida, status:', cerebrasResponse.status);

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

    // Propagar retry-after si existe (para rate limiting)
    const responseHeaders = new Headers();
    const retryAfter = axiosError.response?.headers?.['retry-after'];
    if (retryAfter) {
      responseHeaders.set('retry-after', retryAfter);
    }

    // Generic error message - do not leak upstream details
    return NextResponse.json(
      { error: 'Error processing Cerebras request' },
      { status, headers: responseHeaders }
    );
  }
}
