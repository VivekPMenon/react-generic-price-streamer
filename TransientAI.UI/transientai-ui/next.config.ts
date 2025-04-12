import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
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

  // webpack: (config, { isServer }) => {
  //   // Ignore .node files (like canvas.node)
  //   config.module.rules.push({
  //     test: /\.node$/,
  //     use: 'ignore-loader',
  //   });
  //
  //   // Prevent bundling native canvas on server
  //   if (isServer) {
  //     config.externals.push({ canvas: 'commonjs canvas' });
  //   }
  //
  //   return config;
  // },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/buy',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/macro-panel',
        permanent: true,
      },
      {
        source: '/sell',
        destination: '/dashboard-generic',
        permanent: true, // Set to false if temporary
      },
      {
        source: '/dashboard-generic',
        destination: '/dashboard-generic/todays-axes',
        permanent: true, // Set to false if temporary
      },
    ];
  }
};

export default nextConfig;
