import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const COUNTRY_TO_LOCALE: Record<string, string> = {
  // Paises hispanohablantes
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'CO': 'es',
  'CL': 'es',
  'PE': 'es',
  'VE': 'es',
  'EC': 'es',
  'GT': 'es',
  'CU': 'es',
  'BO': 'es',
  'DO': 'es',
  'HN': 'es',
  'PY': 'es',
  'SV': 'es',
  'NI': 'es',
  'CR': 'es',
  'PA': 'es',
  'UY': 'es',
  'PR': 'es',
  // Paises de habla inglesa
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en',
  'NZ': 'en',
  'IE': 'en',
};

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Si ya tiene un locale en la URL, usar el middleware normal
  const pathnameHasLocale = routing.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return intlMiddleware(request);
  }

  // Verificar si hay preferencia guardada en cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && routing.locales.includes(cookieLocale as typeof routing.locales[number])) {
    return intlMiddleware(request);
  }

  // Detectar por CF-IPCountry de Cloudflare (gratis)
  const cfCountry = request.headers.get('CF-IPCountry');
  if (cfCountry && COUNTRY_TO_LOCALE[cfCountry]) {
    const detectedLocale = COUNTRY_TO_LOCALE[cfCountry];
    const requestWithLocale = new NextRequest(request.url, {
      headers: new Headers(request.headers)
    });
    requestWithLocale.headers.set('Accept-Language', detectedLocale);
    return intlMiddleware(requestWithLocale);
  }

  // Fallback: usar Accept-Language (next-intl lo maneja automaticamente)
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/'
  ]
};
