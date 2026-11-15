import { createHash } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RATE_LIMITS, type RateBucket } from '@/lib/constants/rate-limit';

const isProd = process.env.NODE_ENV === 'production';

let redis: Redis | null | undefined;

// Created on first use, not at import, so a missing or malformed env var can never break the build.
function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    redis = null;
  } else if (!url.startsWith('https://')) {
    console.error('rate limit: UPSTASH_REDIS_REST_URL must be the REST URL starting with https://');
    redis = null;
  } else {
    redis = new Redis({ url, token });
  }

  return redis;
}

const limiters = new Map<RateBucket, Ratelimit>();

function getLimiter(bucket: RateBucket, client: Redis): Ratelimit {
  const existing = limiters.get(bucket);
  if (existing) return existing;

  const { limit, window } = RATE_LIMITS[bucket];
  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `rl:${bucket}`,
  });
  limiters.set(bucket, limiter);
  return limiter;
}

// Only a hash is stored, never the raw IP or email address.
const hashKey = (key: string) => createHash('sha256').update(key).digest('hex').slice(0, 32);

/**
 * 'ok': let it through. 'limited': this visitor sent too many.
 * 'unavailable': the limiter itself is down and this bucket fails closed — not the visitor's fault.
 */
export type RateLimitResult = 'ok' | 'limited' | 'unavailable';

export async function checkRateLimit(bucket: RateBucket, key: string): Promise<RateLimitResult> {
  const { failClosed } = RATE_LIMITS[bucket];
  const redis = getRedis();

  if (!redis) {
    // Without Upstash, protected buckets block in production and are skipped in local development.
    return isProd && failClosed ? 'unavailable' : 'ok';
  }

  try {
    const { success } = await getLimiter(bucket, redis).limit(hashKey(key));
    return success ? 'ok' : 'limited';
  } catch {
    console.error('rate limit: check failed');
    return failClosed ? 'unavailable' : 'ok';
  }
}