const createNextIntlPlugin = require('next-intl/plugin');

// Pointe vers le nouveau fichier i18n/request.ts
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);