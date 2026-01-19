const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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