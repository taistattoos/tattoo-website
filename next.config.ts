import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.*.*', 'localhost'],
  outputFileTracingIncludes: {
    '/api/contact': ['./content/contact/contact.md'],
  },
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
    ];
  },
};

export default nextConfig;