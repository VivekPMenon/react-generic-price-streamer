import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

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
        destination: '/dashboard',
        permanent: true, // Set to false if temporary
      },
      {
        source: '/dashboard',
        destination: '/dashboard/macro-panel',
        permanent: true, // Set to false if temporary
      },
    ]);
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
