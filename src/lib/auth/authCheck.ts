import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedFromRequest } from './session';

/**
 * Check admin authentication for API routes.
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  if (isAuthenticatedFromRequest(request)) {
    return null; // Authenticated
  }
  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  );
}

/**
 * Check Bearer token auth for cron endpoints.
 */
export function requireCronAuth(request: Request): NextResponse | null {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    return null; // Allow in development without secret
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null; // Authorized
}

/**
 * Check auth for proxy/voice routes - allows same-origin requests or authenticated sessions.
 */
export function requireProxyAuth(request: NextRequest): NextResponse | null {
  // Allow authenticated admin sessions
  if (isAuthenticatedFromRequest(request)) return null;

  // In production, check that request comes from our own origin
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null,
    'https://tunixlabs.com',
    'https://www.tunixlabs.com',
    'https://tunixlabs3-production.up.railway.app',
  ].filter(Boolean);

  if (process.env.NODE_ENV === 'production') {
    const requestOrigin = origin || (referer ? new URL(referer).origin : null);
    if (!requestOrigin || !allowedOrigins.some(o => requestOrigin === o)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return null; // Allowed
}

/**
 * Get client IP for rate limiting.
 */
export function getClientIP(request: NextRequest | Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return '127.0.0.1';
}
