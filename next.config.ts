import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Exclude pdf-parse from bundling to prevent test code execution
  serverExternalPackages: ['pdf-parse', 'canvas'],
};

export default nextConfig;
