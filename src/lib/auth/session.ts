import { cookies } from 'next/headers';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-in-production';
const SESSION_COOKIE = 'tunix_session';
const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

export function validateSessionToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [timestamp, signature] = parts;

  // Check expiry
  const age = (Date.now() - parseInt(timestamp)) / 1000;
  if (age > SESSION_MAX_AGE || age < 0) return false;

  // Verify signature
  const expected = crypto.createHmac('sha256', AUTH_SECRET).update(timestamp).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
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
