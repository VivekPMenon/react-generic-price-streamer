import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  async redirects() {
    
    return Promise.resolve([
      {
        source: '/',
        destination: '/dashboard',
        permanent: true, // Set to false if temporary
      },
      {
        source: '/dashboard',
        destination: '/dashboard/research-reports',
        permanent: true, // Set to false if temporary
      },
    ]);
  }
};

export default nextConfig;
