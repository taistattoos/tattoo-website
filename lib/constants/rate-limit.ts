import type { Duration } from '@upstash/ratelimit';

export type RateBucket = 'contactIp' | 'contactGlobal' | 'orderIp' | 'orderRecipient' | 'orderGlobal';

interface RateRule {
  limit: number;
  window: Duration;
  // true: block when Upstash is unavailable. false: let the request through.
  failClosed: boolean;
}

export const RATE_LIMITS: Record<RateBucket, RateRule> = {
  contactIp: { limit: 5, window: '1 h', failClosed: false },
  contactGlobal: { limit: 100, window: '24 h', failClosed: false },
  orderIp: { limit: 3, window: '10 m', failClosed: true },
  orderRecipient: { limit: 2, window: '24 h', failClosed: true },
  orderGlobal: { limit: 50, window: '24 h', failClosed: true },
};