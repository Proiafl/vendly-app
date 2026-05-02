import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "vendly.futuwebs.com", "vendly.app"],
    },
  },
};

export default nextConfig;
