const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {},
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
      {
        urlPattern: /^https?.*(\/api\/auth\/login)/,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^https?.*(\/api\/)/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 300 },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /\.(js|css|woff2?|png|jpg|svg|ico|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: { maxEntries: 200, maxAgeSeconds: 86400 * 30 },
        },
      },
    ],
  },
  async rewrites() {
    // RAILWAY_API_URL is set in Railway dashboard as the internal private URL
    // e.g. http://transitpass-api.railway.internal:8080
    // Falls back to localhost for local dev
    const apiUrl = process.env.RAILWAY_API_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
