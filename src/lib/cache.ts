import { config } from "@/lib/config";
import { TranscriptResult } from "@/lib/types";

/**
 * Tiny in-memory transcript cache (per server instance).
 * Good enough for v1; swap for Redis/Supabase later behind the same interface.
 * Disabled when ENABLE_TRANSCRIPT_CACHE=false.
 */

interface Entry {
  value: TranscriptResult;
  expires: number;
}

const TTL_MS = config.limits.cacheTtlDays * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 1000;
const store = new Map<string, Entry>();

function key(videoId: string, lang?: string) {
  return `${videoId}:${lang || "auto"}`;
}

export function getCached(videoId: string, lang?: string): TranscriptResult | null {
  if (!config.features.transcriptCache) return null;
  const hit = store.get(key(videoId, lang));
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    store.delete(key(videoId, lang));
    return null;
  }
  return hit.value;
}

export function setCached(
  videoId: string,
  lang: string | undefined,
  value: TranscriptResult,
): void {
  if (!config.features.transcriptCache) return;
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(key(videoId, lang), { value, expires: Date.now() + TTL_MS });
}
