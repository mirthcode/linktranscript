/**
 * Centralized runtime configuration & feature flags.
 * All secrets come from environment variables — nothing is hardcoded.
 */

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true" || value === "1";
}

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const config = {
  // Canonical production URL. Override locally with NEXT_PUBLIC_SITE_URL.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://linktranscript.com",

  // AdSense publisher ID, e.g. "ca-pub-XXXXXXXXXXXXXXXX".
  // Empty in v1 — real ad code only renders once this is set (post-approval).
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",

  // Google Analytics 4 Measurement ID, e.g. "G-XXXXXXXXXX". Public by design.
  // When empty, no analytics scripts load.
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",

  ai: {
    // NOTE: AI transforms are a BACKLOG feature, disabled by default in v1.
    apiKey: process.env.OPENAI_API_KEY || "",
    baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    get enabled() {
      return flag(process.env.ENABLE_AI_TRANSFORMS, false) && this.apiKey.length > 0;
    },
  },

  features: {
    aiTransforms: flag(process.env.ENABLE_AI_TRANSFORMS, true),
    personalDownloads: flag(process.env.ENABLE_PERSONAL_DOWNLOADS, false),
    transcriptCache: flag(process.env.ENABLE_TRANSCRIPT_CACHE, true),
    summaries: flag(process.env.ENABLE_SUMMARIES, false),
  },

  // Transcript abuse / cost protection. All limits are per server instance
  // (in-memory) — good enough for v1; swap for a shared store later. Cloudflare
  // is the first line of defense; these are the application-level backstop.
  limits: {
    transcriptIpHourly: num(process.env.TRANSCRIPT_IP_HOURLY_LIMIT, 30),
    transcriptIpDaily: num(process.env.TRANSCRIPT_IP_DAILY_LIMIT, 150),
    transcriptGlobalDaily: num(process.env.TRANSCRIPT_GLOBAL_DAILY_LIMIT, 5000),
    cacheTtlDays: num(process.env.TRANSCRIPT_CACHE_TTL_DAYS, 30),
    summaryIpHourly: num(process.env.SUMMARY_IP_HOURLY_LIMIT, 3),
    summaryIpDaily: num(process.env.SUMMARY_IP_DAILY_LIMIT, 3),
    summaryGlobalDaily: num(process.env.SUMMARY_GLOBAL_DAILY_LIMIT, 500),
    summaryMaxChars: num(process.env.SUMMARY_MAX_TRANSCRIPT_CHARS, 48000),
    summaryCacheTtlDays: num(process.env.SUMMARY_CACHE_TTL_DAYS, 30),
  },

  // Cloudflare Turnstile (optional). When enabled, the transcript/summary routes
  // require a valid token. Off by default so normal users never see a challenge.
  turnstile: {
    enabled: flag(process.env.ENABLE_CLOUDFLARE_TURNSTILE, false),
    secretKey: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || "",
    siteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "",
  },

  youtube: {
    proxyUrl: process.env.YOUTUBE_PROXY_URL || "",
  },

  // Hosted transcript provider (TranscriptAPI). When a key is present, the
  // extraction service uses it instead of direct YouTube fetching — this is what
  // makes extraction work in production, where YouTube blocks datacenter IPs.
  transcriptApi: {
    key: process.env.TRANSCRIPTAPI_KEY || "",
    baseUrl:
      process.env.TRANSCRIPTAPI_BASE_URL ||
      "https://transcriptapi.com/api/v2/youtube",
    get enabled() {
      return this.key.length > 0;
    },
  },
} as const;

/** Public-safe flags that can be sent to the client. */
export function publicFlags() {
  return {
    aiEnabled: config.ai.enabled,
    personalDownloads: config.features.personalDownloads,
  };
}
