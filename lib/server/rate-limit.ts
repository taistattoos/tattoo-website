import { createHash } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RATE_LIMITS, type RateBucket } from '@/lib/constants/rate-limit';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;
const isProd = process.env.NODE_ENV === 'production';

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

// Returns true when the request must be refused.
export async function isRateLimited(bucket: RateBucket, key: string): Promise<boolean> {
  const { failClosed } = RATE_LIMITS[bucket];

  if (!redis) {
    // Without Upstash, protected buckets block in production and are skipped in local development.
    return isProd && failClosed;
  }

  try {
    const { success } = await getLimiter(bucket, redis).limit(hashKey(key));
    return !success;
  } catch {
    console.error('rate limit: check failed');
    return failClosed;
  }
}