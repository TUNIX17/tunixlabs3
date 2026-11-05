/**
 * URLs del sitio anterior (agencia Tunix Labs) que Google y otros enlaces aún
 * conocen. Función pura: la usa src/proxy.ts ANTES de next-intl.
 *
 * - 410 Gone (+ noindex): los casos de clientes y sus imágenes. No deben volver
 *   a indexarse bajo ninguna forma; un 301 al home los dejaría "vivos" en Google.
 * - 301 al home del idioma: las páginas de la agencia que ya no existen
 *   (inicio, servicios, sobre, contacto, v3). OJO: `permanent: true` de
 *   next.config da 308, no 301; por eso el redirect se emite desde el proxy.
 * - null: no es una URL vieja; sigue el flujo normal.
 */

export type ClasificacionUrlVieja =
  | { tipo: '410' }
  | { tipo: '301'; destino: string }
  | null;

// /casos, /cases, /es/casos/x, /en/cases/x ... y las carpetas de public/ que
// servían imágenes de los casos.
const GONE =
  /^(?:\/(?:es|en))?\/(?:casos|cases)(?:\/.*)?$|^\/(?:case-studies|logos)(?:\/.*)?$/;

// Sin prefijo de idioma: las rutas en español de la agencia (hoy responderían
// /es/<ruta>); van al home en español.
const SIN_IDIOMA = /^\/(?:inicio|servicios(?:\/.*)?|sobre|contacto|v3)\/?$/;

// Con prefijo de idioma: cualquier slug viejo, en español o en inglés (el
// canonical anterior apuntaba a /en/inicio, que Google pudo indexar).
const CON_IDIOMA =
  /^\/(es|en)\/(?:inicio|home|v3|sobre|about|contacto|contact|(?:servicios|services)(?:\/.*)?)\/?$/;

export function clasificarUrlVieja(pathname: string): ClasificacionUrlVieja {
  if (GONE.test(pathname)) return { tipo: '410' };

  if (SIN_IDIOMA.test(pathname)) return { tipo: '301', destino: '/es' };

  const conIdioma = CON_IDIOMA.exec(pathname);
  if (conIdioma) return { tipo: '301', destino: `/${conIdioma[1]}` };

  return null;
}
