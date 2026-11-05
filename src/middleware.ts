import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Modo mantención (2026-11-05): todo el sitio responde 503 con un aviso,
// incluidas las imágenes de public/, los bundles de /_next y las rutas de /api.
// Para volver al sitio normal: EN_MANTENCION = false.
const EN_MANTENCION = true;

// Lo único que sigue respondiendo durante la mantención: el webhook de Calendly
// (registra leads, no muestra contenido) y el favicon.
const PERMITIDO_EN_MANTENCION = /^\/(api\/webhooks\/|favicon\.ico$)/;

// Rutas que procesa next-intl: es el matcher que tenía este archivo antes de la
// mantención, ahora evaluado aquí porque el matcher de abajo cubre todo.
const RUTAS_DE_PAGINA = /^\/(?!api|_next|_vercel|.*\..*).*$/;

const PAGINA_MANTENCION = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>TunixLabs — En mantención</title>
<style>
  :root { color-scheme: light dark; --bg: #f6f5f2; --fg: #1c1b19; --muted: #6b6862; --line: #dedbd4; }
  @media (prefers-color-scheme: dark) { :root { --bg: #121211; --fg: #ecebe7; --muted: #a09d96; --line: #2e2d2a; } }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px;
         background: var(--bg); color: var(--fg);
         font: 16px/1.55 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  main { max-width: 30rem; text-align: center; }
  .marca { font-weight: 600; letter-spacing: .02em; color: var(--muted); margin: 0 0 2rem; }
  h1 { font-size: 1.75rem; line-height: 1.2; margin: 0 0 .75rem; }
  p { margin: 0; color: var(--muted); }
  hr { border: 0; border-top: 1px solid var(--line); margin: 2rem auto; width: 4rem; }
</style>
</head>
<body>
<main>
  <p class="marca">TunixLabs</p>
  <h1>Sitio en mantención</h1>
  <p>Estamos actualizando el sitio. Volvemos pronto.</p>
  <hr>
  <p lang="en">We're updating the site. We'll be back soon.</p>
</main>
</body>
</html>`;

function respuestaMantencion() {
  return new NextResponse(PAGINA_MANTENCION, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Retry-After': '86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}

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

  if (EN_MANTENCION && !PERMITIDO_EN_MANTENCION.test(pathname)) {
    return respuestaMantencion();
  }

  if (!RUTAS_DE_PAGINA.test(pathname)) {
    return NextResponse.next();
  }

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
  // Todas las rutas (también /_next, /api y los archivos de public/) para que la
  // mantención las cubra; el filtro de páginas lo hace RUTAS_DE_PAGINA.
  matcher: ['/:path*'],
};
