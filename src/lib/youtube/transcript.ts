import {
  CaptionTrack,
  TranscriptError,
  TranscriptResult,
  TranscriptSegment,
  VideoMeta,
} from "@/lib/types";
import { ytFetch } from "./fetcher";
import { extractVideoId, thumbnailUrl, watchUrl } from "./url";

/**
 * Transcript extraction service.
 *
 * Strategy (mirrors how public transcript tools work):
 *   1. Load the watch page, pull `ytInitialPlayerResponse` JSON.
 *   2. Read the caption track list + video details from it.
 *   3. If the watch page is gated, fall back to the InnerTube `player` endpoint.
 *   4. Fetch the chosen caption track as json3 and parse to segments.
 *
 * Everything lives behind `getTranscript()` so the provider can be swapped later
 * (e.g. a hosted transcript API) without touching the rest of the app.
 */

interface RawCaptionTrack {
  baseUrl: string;
  languageCode: string;
  kind?: string; // "asr" for auto-generated
  name?: { simpleText?: string; runs?: { text: string }[] };
}

interface PlayerResponse {
  playabilityStatus?: { status?: string; reason?: string };
  videoDetails?: {
    videoId?: string;
    title?: string;
    author?: string;
    lengthSeconds?: string;
    thumbnail?: { thumbnails?: { url: string }[] };
  };
  captions?: {
    playerCaptionsTracklistRenderer?: {
      captionTracks?: RawCaptionTrack[];
    };
  };
}

const INNERTUBE_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"; // public web client key
const INNERTUBE_URL = `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_KEY}`;

export interface GetTranscriptOptions {
  /** Preferred language code, e.g. "en". Falls back to first available. */
  lang?: string;
}

export async function getTranscript(
  input: string,
  options: GetTranscriptOptions = {},
): Promise<TranscriptResult> {
  const videoId = extractVideoId(input);

  let player = await fetchPlayerFromWatchPage(videoId);
  if (!player || !hasCaptions(player)) {
    // Fall back to InnerTube if the watch page didn't yield captions.
    const innertube = await fetchPlayerFromInnertube(videoId);
    if (innertube && hasCaptions(innertube)) player = innertube;
    else if (!player) player = innertube;
  }

  if (!player) {
    throw new TranscriptError(
      "FETCH_FAILED",
      "Could not load video data from YouTube.",
      502,
    );
  }

  assertPlayable(player);

  const tracks =
    player.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
  if (tracks.length === 0) {
    throw new TranscriptError(
      "NO_TRANSCRIPT",
      "No caption tracks available for this video.",
      404,
    );
  }

  const chosen = pickTrack(tracks, options.lang);
  const segments = await fetchSegments(chosen.baseUrl);
  if (segments.length === 0) {
    throw new TranscriptError(
      "NO_TRANSCRIPT",
      "Caption track is empty for this video.",
      404,
    );
  }

  const meta = buildMeta(videoId, player);
  const text = segments.map((s) => s.text).join(" ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    meta,
    language: chosen.languageCode,
    availableTracks: tracks.map(toCaptionTrack),
    segments,
    wordCount,
    charCount: text.length,
    readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
    generatedAt: new Date().toISOString(),
  };
}

/* ----------------------------- internals ----------------------------- */

function hasCaptions(p: PlayerResponse): boolean {
  return (
    (p.captions?.playerCaptionsTracklistRenderer?.captionTracks?.length ?? 0) > 0
  );
}

async function fetchPlayerFromWatchPage(
  videoId: string,
): Promise<PlayerResponse | null> {
  try {
    const res = await ytFetch(watchUrl(videoId));
    if (res.status === 429) throw new TranscriptError("RATE_LIMITED", "", 429);
    if (!res.ok) return null;
    const html = await res.text();
    const json = extractJsonObject(html, "ytInitialPlayerResponse");
    return json as PlayerResponse | null;
  } catch (e) {
    if (e instanceof TranscriptError) throw e;
    return null;
  }
}

async function fetchPlayerFromInnertube(
  videoId: string,
): Promise<PlayerResponse | null> {
  try {
    const res = await ytFetch(INNERTUBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240401.00.00",
            hl: "en",
          },
        },
      }),
    });
    if (res.status === 429) throw new TranscriptError("RATE_LIMITED", "", 429);
    if (!res.ok) return null;
    return (await res.json()) as PlayerResponse;
  } catch (e) {
    if (e instanceof TranscriptError) throw e;
    return null;
  }
}

function assertPlayable(p: PlayerResponse) {
  const status = p.playabilityStatus?.status;
  if (!status || status === "OK") return;
  const reason = (p.playabilityStatus?.reason || "").toLowerCase();
  if (status === "LOGIN_REQUIRED" || reason.includes("age")) {
    throw new TranscriptError("AGE_RESTRICTED", reason, 403);
  }
  if (
    status === "UNPLAYABLE" ||
    status === "ERROR" ||
    reason.includes("unavailable") ||
    reason.includes("private")
  ) {
    throw new TranscriptError("VIDEO_UNAVAILABLE", reason, 404);
  }
}

function pickTrack(
  tracks: RawCaptionTrack[],
  lang?: string,
): RawCaptionTrack {
  if (lang) {
    const exact = tracks.find((t) => t.languageCode === lang);
    if (exact) return exact;
    const prefix = tracks.find((t) => t.languageCode.startsWith(lang));
    if (prefix) return prefix;
  }
  // Prefer a manually-created English track, then any manual track, then first.
  return (
    tracks.find((t) => t.languageCode.startsWith("en") && t.kind !== "asr") ||
    tracks.find((t) => t.kind !== "asr") ||
    tracks[0]
  );
}

async function fetchSegments(baseUrl: string): Promise<TranscriptSegment[]> {
  const url = appendParam(baseUrl, "fmt", "json3");
  const res = await ytFetch(url);
  if (res.status === 429) throw new TranscriptError("RATE_LIMITED", "", 429);
  if (!res.ok)
    throw new TranscriptError("FETCH_FAILED", "Caption fetch failed.", 502);

  const body = await res.text();
  // json3 first; fall back to XML if YouTube ignored the fmt param.
  if (body.trimStart().startsWith("{")) return parseJson3(body);
  return parseXml(body);
}

function parseJson3(body: string): TranscriptSegment[] {
  let data: { events?: { tStartMs?: number; dDurationMs?: number; segs?: { utf8?: string }[] }[] };
  try {
    data = JSON.parse(body);
  } catch {
    return [];
  }
  const out: TranscriptSegment[] = [];
  for (const ev of data.events || []) {
    if (!ev.segs) continue;
    const text = cleanText(ev.segs.map((s) => s.utf8 || "").join(""));
    if (!text) continue;
    out.push({
      start: (ev.tStartMs || 0) / 1000,
      duration: (ev.dDurationMs || 0) / 1000,
      text,
    });
  }
  return out;
}

function parseXml(body: string): TranscriptSegment[] {
  const out: TranscriptSegment[] = [];
  const re = /<text start="([\d.]+)"(?: dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const text = cleanText(decodeEntities(m[3]));
    if (!text) continue;
    out.push({
      start: parseFloat(m[1]) || 0,
      duration: parseFloat(m[2] || "0") || 0,
      text,
    });
  }
  return out;
}

function buildMeta(videoId: string, p: PlayerResponse): VideoMeta {
  const d = p.videoDetails;
  const thumbs = d?.thumbnail?.thumbnails;
  return {
    videoId,
    title: d?.title || "Untitled video",
    author: d?.author,
    thumbnail: thumbs?.[thumbs.length - 1]?.url || thumbnailUrl(videoId),
    sourceUrl: watchUrl(videoId),
    durationSeconds: d?.lengthSeconds ? Number(d.lengthSeconds) : undefined,
  };
}

function toCaptionTrack(t: RawCaptionTrack): CaptionTrack {
  return {
    languageCode: t.languageCode,
    label:
      t.name?.simpleText ||
      t.name?.runs?.map((r) => r.text).join("") ||
      t.languageCode,
    autoGenerated: t.kind === "asr",
  };
}

/* ----------------------------- text utils ----------------------------- */

/** Pull a JSON object assigned to `varName` out of an HTML page. */
function extractJsonObject(html: string, varName: string): unknown | null {
  const marker = `${varName} = `;
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const start = idx + marker.length;
  // Walk braces to find the matching close, respecting strings/escapes.
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const slice = html.slice(start, i + 1);
        try {
          return JSON.parse(slice);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function cleanText(s: string): string {
  return s
    .replace(/\s+/g, " ") // collapse repeated whitespace
    .replace(/^[\s​]+|[\s​]+$/g, "")
    .trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function appendParam(url: string, key: string, value: string): string {
  return url.includes(`${key}=`)
    ? url
    : `${url}${url.includes("?") ? "&" : "?"}${key}=${value}`;
}
