const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  experimental: {
    // Enables src/instrumentation.ts — spawns the Chatwoot polling loop
    // at server startup (failsafe against hosted webhook non-delivery).
    // Next.js 13.5+ flag; GA in Next.js 14.
    instrumentationHook: true,
  },
  images: {
    domains: ['tunixlabs.com'],
  },

  // Webpack configuration for ONNX runtime (Silero VAD)
  webpack: (config, { isServer }) => {
    // Only configure for client-side
    if (!isServer) {
      // Handle WASM files as assets
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };

      // Fallback for node modules not available in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(), payment=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/inicio',
        destination: '/es/inicio',
        permanent: true,
      },
      {
        source: '/servicios',
        destination: '/es/servicios',
        permanent: true,
      },
      {
        source: '/servicios/:path*',
        destination: '/es/servicios/:path*',
        permanent: true,
      },
      {
        source: '/contacto',
        destination: '/es/contacto',
        permanent: true,
      },
      // Dropped services (sprint 2026-04-08) — redirect any cached link
      // to the homepage services section so visitors don't hit a 404.
      // The `:locale` segment matches /es or /en (or any other two-letter
      // locale next-intl routes to).
      {
        source: '/:locale/servicios/automatizacion-marketing-ia',
        destination: '/:locale/inicio#servicios',
        permanent: true,
      },
      {
        source: '/:locale/servicios/generacion-contenido-ia',
        destination: '/:locale/inicio#servicios',
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig); 