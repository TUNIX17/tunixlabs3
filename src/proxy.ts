import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { clasificarUrlVieja } from './lib/legacy-urls';

// Modo mantención: encendido por defecto. Todo el sitio responde 503 con un
// aviso, incluidas las imágenes de public/, los bundles de /_next y /api.
// Se apaga con MANTENCION=0 (local, staging y, al publicar, producción).
// Se lee en cada request para que el valor sea el del entorno en ejecución.
const enMantencion = () => process.env.MANTENCION !== '0';

// Lo único que sigue respondiendo durante la mantención: el webhook de Calendly
// (registra leads, no muestra contenido) y el favicon.
const PERMITIDO_EN_MANTENCION = /^\/(api\/webhooks\/|favicon\.ico$)/;

// Rutas que procesa next-intl. El matcher de abajo cubre todo (la mantención lo
// necesita y un matcher debe ser estático), así que el filtro vive aquí:
// quedan fuera /admin, /api, /_next, /_vercel y cualquier archivo con extensión.
const RUTAS_DE_PAGINA = /^\/(?!api(?:\/|$)|admin(?:\/|$)|_next|_vercel|.*\..*).*$/;

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

function respuestaUrlVieja(request: NextRequest): NextResponse | null {
  const clasificacion = clasificarUrlVieja(request.nextUrl.pathname);
  if (!clasificacion) return null;

  if (clasificacion.tipo === '410') {
    return new NextResponse(
      '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
        '<meta name="robots" content="noindex"><title>410</title></head>' +
        '<body><p>Este contenido ya no existe. / This content is gone.</p></body></html>',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Robots-Tag': 'noindex',
        },
      }
    );
  }

  const url = request.nextUrl.clone();
  url.pathname = clasificacion.destino;
  url.search = '';
  return NextResponse.redirect(url, 301);
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (enMantencion() && !PERMITIDO_EN_MANTENCION.test(pathname)) {
    return respuestaMantencion();
  }

  // URLs de la agencia anterior: antes de next-intl, que las redirigiría a
  // páginas que ya no existen.
  const vieja = respuestaUrlVieja(request);
  if (vieja) return vieja;

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
  // mantención y las URLs viejas las cubran; el filtro de páginas es
  // RUTAS_DE_PAGINA.
  matcher: ['/:path*'],
};
