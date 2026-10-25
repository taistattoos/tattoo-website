import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.*.*', 'localhost'],
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
    ];
  },
};

export default nextConfig;