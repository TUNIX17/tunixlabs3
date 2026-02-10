const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
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
    ];
  },
};

module.exports = withNextIntl(nextConfig); 