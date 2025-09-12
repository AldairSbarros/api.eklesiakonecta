import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedis() {
  if (!process.env.REDIS_URL) return null; // modo degradado
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    });
  }
  return redis;
}

export async function withRedis<T>(fn: (r: Redis) => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  const r = getRedis();
  if (!r) return fallback();
  try { return await fn(r); } catch { return fallback(); }
}
