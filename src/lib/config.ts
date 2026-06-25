/**
 * Centralized runtime configuration & feature flags.
 * All secrets come from environment variables — nothing is hardcoded.
 */

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true" || value === "1";
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
