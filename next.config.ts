import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const baseHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// Public site. Turnstile needs scripts, frames and connections to challenges.cloudflare.com.
const siteCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isProd ? '' : " 'unsafe-eval'"}`,
  'frame-src https://challenges.cloudflare.com',
  `connect-src 'self' https://challenges.cloudflare.com${isProd ? '' : ' ws: wss:'}`,
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

// CMS. Decap is loaded from unpkg (pinned with an integrity hash) and talks to GitHub.
const adminCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
  "connect-src 'self' https://api.github.com",
  "img-src 'self' data: blob: https://*.githubusercontent.com",
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

// Report-only: the browser logs violations in the console but blocks nothing.
// Once the console is clean, change the key to 'Content-Security-Policy'.
const CSP_HEADER = 'Content-Security-Policy-Report-Only';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.*.*', 'localhost'],
  outputFileTracingIncludes: {
    '/api/contact': ['./content/contact/contact.md'],
    '/api/order': ['./content/products/**/*', './content/site/site.md', './content/shop/order.md'],
  },
  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
  async headers() {
    return [
      {
        source: '/((?!admin).*)',
        headers: [...baseHeaders, { key: CSP_HEADER, value: siteCsp }],
      },
      {
        source: '/admin',
        headers: [...baseHeaders, { key: CSP_HEADER, value: adminCsp }],
      },
      {
        source: '/admin/:path*',
        headers: [...baseHeaders, { key: CSP_HEADER, value: adminCsp }],
      },
    ];
  },
};

export default nextConfig;