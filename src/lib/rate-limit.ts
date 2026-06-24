/**
 * Minimal sliding-window rate limiter (per server instance, in-memory).
 * Keyed by client IP. Replace with a shared store for multi-instance deploys.
 */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

export function rateLimit(
  ip: string,
  { limit = 20, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(ip) || { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - bucket.hits[0])) / 1000);
    buckets.set(ip, bucket);
    return { ok: false, remaining: 0, retryAfter };
  }

  bucket.hits.push(now);
  buckets.set(ip, bucket);
  return { ok: true, remaining: limit - bucket.hits.length, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anonymous";
}
