import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/inicio': {
      es: '/inicio',
      en: '/home'
    },
    '/servicios': {
      es: '/servicios',
      en: '/services'
    },
    '/servicios/desarrollos-web': {
      es: '/servicios/desarrollos-web',
      en: '/services/web-development'
    },
    '/servicios/machine-learning': {
      es: '/servicios/machine-learning',
      en: '/services/machine-learning'
    },
    '/servicios/asistentes-ia': {
      es: '/servicios/asistentes-ia',
      en: '/services/ai-assistants'
    },
    '/servicios/business-intelligence': {
      es: '/servicios/business-intelligence',
      en: '/services/business-intelligence'
    },
    '/servicios/vision-artificial': {
      es: '/servicios/vision-artificial',
      en: '/services/computer-vision'
    },
    '/servicios/consultoria-ia': {
      es: '/servicios/consultoria-ia',
      en: '/services/ai-consulting'
    },
    '/servicios/rpa': {
      es: '/servicios/rpa',
      en: '/services/rpa'
    },
    '/servicios/generacion-contenido-ia': {
      es: '/servicios/generacion-contenido-ia',
      en: '/services/ai-content-generation'
    },
    '/servicios/automatizacion-marketing-ia': {
      es: '/servicios/automatizacion-marketing-ia',
      en: '/services/ai-marketing-automation'
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact'
    }
  }
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
