import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: "build",
  output: "standalone",
  async redirects() {
    
    return Promise.resolve([
      {
        source: '/',
        destination: '/dashboard-generic',
        permanent: true, // Set to false if temporary
      },
      // {
      //   source: '/dashboard',
      //   destination: '/dashboard/macro-panel',
      //   permanent: true, // Set to false if temporary
      // },
    ]);
  }
};

export default nextConfig;
