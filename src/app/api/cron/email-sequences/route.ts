/**
 * API Route: /api/cron/email-sequences
 * Endpoint para el cron job de Railway
 * Procesa las secuencias de email de nurturing
 *
 * Configurar en Railway:
 * cron: 0 * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://tunixlabs.com/api/cron/email-sequences
 */

import { NextResponse } from 'next/server';
import { processEmailSequences } from '@/lib/email/sequences';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos max

export async function GET(request: Request) {
  console.log('[Cron] Email sequences job iniciado');

  // Verificar autorizacion
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Si hay CRON_SECRET configurado, verificar
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron] Intento no autorizado');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  } else {
    // Si no hay secret, permitir solo en desarrollo
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Cron] CRON_SECRET no configurado en produccion');
      // Permitir de todas formas por ahora, pero logear warning
    }
  }

  try {
    const startTime = Date.now();

    // Procesar secuencias
    const result = await processEmailSequences();

    const duration = Date.now() - startTime;

    console.log(`[Cron] Job completado en ${duration}ms:`, result);

    return NextResponse.json({
      success: true,
      ...result,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Cron] Error en job:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check para Railway
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
