import { TranscriptError } from "@/lib/types";

/**
 * Extract a YouTube video ID from any common URL shape:
 *  - https://www.youtube.com/watch?v=ID
 *  - https://youtu.be/ID
 *  - https://www.youtube.com/embed/ID
 *  - https://www.youtube.com/shorts/ID
 *  - https://www.youtube.com/live/ID
 *  - a bare 11-char ID
 */
export function extractVideoId(input: string): string {
  const raw = (input || "").trim();
  if (!raw) throw new TranscriptError("INVALID_URL", "Empty input.");

  // Bare ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  let url: URL;
  try {
    url = new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    throw new TranscriptError("INVALID_URL", "Could not parse URL.");
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    if (isValidId(id)) return id;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && isValidId(v)) return v;

    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts[0];
    if (["embed", "shorts", "live", "v"].includes(marker) && isValidId(parts[1])) {
      return parts[1];
    }
  }

  throw new TranscriptError("INVALID_URL", "No video ID found in URL.");
}

function isValidId(id: string | undefined): id is string {
  return !!id && /^[a-zA-Z0-9_-]{11}$/.test(id);
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function thumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
