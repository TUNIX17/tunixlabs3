const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['tunixlabs.com'],
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