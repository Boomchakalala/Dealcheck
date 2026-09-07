import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Allow preview URLs for development
  allowedDevOrigins: ['preview-biyuzibqkmay.share.sandbox.dev'],

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Exclude pdf-parse from bundling to prevent test code execution
  serverExternalPackages: ['pdf-parse', 'canvas'],

  async redirects() {
    return [
      { source: '/example', destination: '/demo', permanent: true },
      { source: '/example/:path*', destination: '/demo/:path*', permanent: true },
      // Retired blog posts (2026-09): off-topic for the SaaS / IT / marketing audience.
      { source: '/blog/how-to-negotiate-car-purchase', destination: '/blog', permanent: true },
      { source: '/blog/what-to-check-before-signing-equipment-lease', destination: '/blog', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
};

export default withNextIntl(nextConfig);
