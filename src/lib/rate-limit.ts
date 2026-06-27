import { config } from "@/lib/config";

/**
 * Application-level rate limiting (per server instance, in-memory).
 * Fixed-window counters keyed by IP + scope, plus a global daily cap.
 * Cloudflare is the first line of defense; this is the cost backstop so a burst
 * of requests can't run up variable-cost API bills. Swap for a shared store
 * (Redis/Upstash) when running multiple instances.
 */

interface Window {
  count: number;
  resetAt: number;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const store = new Map<string, Window>();

function peek(key: string, limit: number): boolean {
  const now = Date.now();
  const w = store.get(key);
  if (!w || now >= w.resetAt) return true; // fresh window → allowed
  return w.count < limit;
}

function incr(key: string, windowMs: number): void {
  const now = Date.now();
  const w = store.get(key);
  if (!w || now >= w.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
  } else {
    w.count += 1;
  }
}

function retryAfterFor(key: string): number {
  const now = Date.now();
  const w = store.get(key);
  if (w && now < w.resetAt) return Math.max(1, Math.ceil((w.resetAt - now) / 1000));
  return 60;
}

export interface LimitResult {
  ok: boolean;
  retryAfter: number; // seconds
  reason?: "ip_hourly" | "ip_daily" | "global_daily";
}

interface Rule {
  key: string;
  limit: number;
  window: number;
  reason: LimitResult["reason"];
}

function enforce(rules: Rule[]): LimitResult {
  // Check all first (no increment) so one tripped limit doesn't consume others.
  for (const r of rules) {
    if (!peek(r.key, r.limit)) {
      return { ok: false, retryAfter: retryAfterFor(r.key), reason: r.reason };
    }
  }
  for (const r of rules) incr(r.key, r.window);
  return { ok: true, retryAfter: 0 };
}

/** Per-IP hourly + daily, plus a global daily cap, for transcript generation. */
export function checkTranscriptLimit(ip: string): LimitResult {
  return enforce([
    { key: `t:h:${ip}`, limit: config.limits.transcriptIpHourly, window: HOUR, reason: "ip_hourly" },
    { key: `t:d:${ip}`, limit: config.limits.transcriptIpDaily, window: DAY, reason: "ip_daily" },
    { key: "t:g", limit: config.limits.transcriptGlobalDaily, window: DAY, reason: "global_daily" },
  ]);
}

/** Tighter limits for summary generation (variable AI cost). */
export function checkSummaryLimit(ip: string): LimitResult {
  return enforce([
    { key: `s:h:${ip}`, limit: config.limits.summaryIpHourly, window: HOUR, reason: "ip_hourly" },
    { key: `s:d:${ip}`, limit: config.limits.summaryIpDaily, window: DAY, reason: "ip_daily" },
    { key: "s:g", limit: config.limits.summaryGlobalDaily, window: DAY, reason: "global_daily" },
  ]);
}

export function clientIp(req: Request): string {
  // Cloudflare sets cf-connecting-ip; Vercel/proxies set x-forwarded-for.
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anonymous";
}

/** Lightweight abuse log (stdout). Replace with a real sink later. */
export function logAbuse(
  scope: string,
  ip: string,
  detail: Record<string, unknown> = {},
): void {
  // eslint-disable-next-line no-console
  console.warn(
    `[abuse] ${scope} ip=${ip} ${Object.entries(detail)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ")}`,
  );
}
