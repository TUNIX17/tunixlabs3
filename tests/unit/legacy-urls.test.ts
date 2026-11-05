import { describe, expect, it } from 'vitest';
import { clasificarUrlVieja } from '../../src/lib/legacy-urls';

const GONE = { tipo: '410' } as const;
const a = (destino: string) => ({ tipo: '301', destino }) as const;

describe('clasificarUrlVieja', () => {
  const tabla: Array<[string, ReturnType<typeof clasificarUrlVieja>]> = [
    // 410: casos y sus imágenes
    ['/casos', GONE],
    ['/casos/sime', GONE],
    ['/es/casos', GONE],
    ['/es/casos/rapigas', GONE],
    ['/en/cases', GONE],
    ['/en/cases/some-case', GONE],
    ['/cases/sime-hero.png', GONE],
    ['/case-studies/x.pdf', GONE],
    ['/logos/codelco.svg', GONE],

    // 301 sin prefijo de idioma -> /es
    ['/inicio', a('/es')],
    ['/inicio/', a('/es')],
    ['/servicios', a('/es')],
    ['/servicios/rpa', a('/es')],
    ['/servicios/desarrollos-web', a('/es')],
    ['/sobre', a('/es')],
    ['/contacto', a('/es')],

    // 301 con prefijo
    ['/es/inicio', a('/es')],
    ['/es/servicios', a('/es')],
    ['/es/servicios/machine-learning', a('/es')],
    ['/es/sobre', a('/es')],
    ['/es/contacto', a('/es')],
    ['/es/v3', a('/es')],
    ['/en/home', a('/en')],
    ['/en/services', a('/en')],
    ['/en/services/web-development', a('/en')],
    ['/en/about', a('/en')],
    ['/en/contact', a('/en')],
    ['/en/v3', a('/en')],
    ['/en/inicio', a('/en')], // canonical equivocado del sitio anterior

    // No son URLs viejas
    ['/', null],
    ['/es', null],
    ['/en', null],
    ['/es/', null],
    ['/admin', null],
    ['/admin/leads', null],
    ['/api/contact', null],
    ['/api/webhooks/calendly', null],
    ['/resume', null],
    ['/es/resume', null],
    ['/en/resume', null],
    ['/casos-de-exito', null], // frontera: no es /casos
    ['/logos-nuevos', null],
    ['/robots.txt', null],
    ['/favicon.ico', null],
  ];

  it.each(tabla)('%s', (pathname, esperado) => {
    expect(clasificarUrlVieja(pathname)).toEqual(esperado);
  });
});
