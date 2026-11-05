import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedFromRequest } from './session';

/**
 * Check admin authentication for API routes.
 * Returns null if authenticated, or a 401 NextResponse if not.
 * Synchronous - uses cookie-based session validation.
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  if (isAuthenticatedFromRequest(request)) {
    return null;
  }
  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  );
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
