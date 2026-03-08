import type { NextConfig } from "next";

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

export default nextConfig;
