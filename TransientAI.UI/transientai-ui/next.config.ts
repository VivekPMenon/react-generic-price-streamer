import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    
    return Promise.resolve([
      {
        source: '/',
        destination: '/dashboard',
        permanent: true, // Set to false if temporary
      },
      {
        source: '/dashboard',
        destination: '/dashboard/corporate-actions',
        permanent: true, // Set to false if temporary
      },
    ]);
  }
};

export default nextConfig;
