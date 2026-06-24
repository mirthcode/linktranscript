import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { FRIENDLY_ERRORS, TranscriptError } from "@/lib/types";
import { getTranscript } from "@/lib/youtube/transcript";
import { extractVideoId } from "@/lib/youtube/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(ip, { limit: 15, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: FRIENDLY_ERRORS.RATE_LIMITED, code: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let url = "";
  let lang: string | undefined;
  try {
    const body = await req.json();
    url = String(body.url || "");
    lang = body.lang ? String(body.lang) : undefined;
  } catch {
    return NextResponse.json(
      { error: FRIENDLY_ERRORS.INVALID_URL, code: "INVALID_URL" },
      { status: 400 },
    );
  }

  try {
    const videoId = extractVideoId(url); // validates early
    const cached = getCached(videoId, lang);
    if (cached) {
      return NextResponse.json({ result: cached, cached: true });
    }

    const result = await getTranscript(url, { lang });
    setCached(videoId, lang, result);
    return NextResponse.json({ result, cached: false });
  } catch (e) {
    if (e instanceof TranscriptError) {
      return NextResponse.json(
        { error: FRIENDLY_ERRORS[e.code], code: e.code },
        { status: e.status },
      );
    }
    // Never leak stack traces to the client.
    return NextResponse.json(
      { error: FRIENDLY_ERRORS.UNKNOWN, code: "UNKNOWN" },
      { status: 500 },
    );
  }
}
