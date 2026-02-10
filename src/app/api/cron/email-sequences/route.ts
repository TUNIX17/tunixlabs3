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
import { requireCronAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos max

export async function GET(request: Request) {
  console.log('[Cron] Email sequences job iniciado');

  try {
    // Verify authorization (denies access in production when CRON_SECRET is not set)
    const authError = requireCronAuth(request);
    if (authError) return authError;

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
        error: 'Processing error',
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
