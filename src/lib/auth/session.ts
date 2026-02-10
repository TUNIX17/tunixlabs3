import { cookies } from 'next/headers';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

const SESSION_DEV_SECRET = 'dev-secret-change-in-production';

/** Returns the auth secret, failing loudly at runtime in production if not set. */
function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET environment variable is required in production');
  }
  return SESSION_DEV_SECRET;
}

const SESSION_COOKIE = 'tunix_session';
const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${timestamp}.${nonce}`;
  const signature = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function validateSessionToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [timestamp, nonce, signature] = parts;

  // Validate timestamp is numeric
  const timestampMs = parseInt(timestamp, 10);
  if (isNaN(timestampMs)) return false;

  // Check expiry
  const age = (Date.now() - timestampMs) / 1000;
  if (age > SESSION_MAX_AGE || age < 0) return false;

  // Validate nonce format (32 hex chars = 16 bytes)
  if (!/^[a-f0-9]{32}$/.test(nonce)) return false;

  // Verify signature
  const payload = `${timestamp}.${nonce}`;
  const expected = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch (error) {
    console.error('[Auth] Token validation error:', error);
    return false;
  }
}

export async function setSessionCookie(): Promise<void> {
  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return validateSessionToken(token);
}

// For use in API routes - checks request cookie
export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return validateSessionToken(token);
}
