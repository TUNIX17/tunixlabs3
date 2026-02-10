import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setSessionCookie, getClientIP } from '@/lib/auth';
import { LoginSchema } from '@/lib/validation/schemas';
import { loginLimiter } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    const rl = loginLimiter.check(ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!verifyAdminPassword(result.data.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await setSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
