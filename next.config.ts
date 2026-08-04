import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    viewTransition: false,
  },
};

export default nextConfig;
