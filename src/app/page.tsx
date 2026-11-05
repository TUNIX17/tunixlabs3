import { redirect } from 'next/navigation';

/**
 * Defensive fallback: en ejecución normal el proxy (src/proxy.ts) intercepta `/`
 * y lo manda al idioma correcto (cookie, CF-IPCountry o Accept-Language), así que
 * este archivo no se alcanza. Existe como red de seguridad (CDN, mala configuración
 * del proxy).
 */
export default function RootPage() {
  redirect('/es');
}
