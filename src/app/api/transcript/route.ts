import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";
import {
  checkTranscriptLimit,
  clientIp,
  logAbuse,
} from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { FRIENDLY_ERRORS, TranscriptError } from "@/lib/types";
import { getTranscript } from "@/lib/youtube/transcript";
import { extractVideoId } from "@/lib/youtube/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Parse body first so we can read a cache hit before spending any quota.
  let url = "";
  let lang: string | undefined;
  let turnstileToken: string | undefined;
  try {
    const body = await req.json();
    url = String(body.url || "");
    lang = body.lang ? String(body.lang) : undefined;
    turnstileToken = body.turnstileToken ? String(body.turnstileToken) : undefined;
  } catch {
    return NextResponse.json(
      { error: FRIENDLY_ERRORS.INVALID_URL, code: "INVALID_URL" },
      { status: 400 },
    );
  }

  // Validate the URL up front (cheap, no quota).
  let videoId: string;
  try {
    videoId = extractVideoId(url);
  } catch {
    return NextResponse.json(
      { error: FRIENDLY_ERRORS.INVALID_URL, code: "INVALID_URL" },
      { status: 400 },
    );
  }

  // Cache-first: serve cached transcripts WITHOUT consuming rate limit or
  // calling the paid/variable-cost provider.
  const cached = getCached(videoId, lang);
  if (cached) {
    return NextResponse.json({ result: cached, cached: true });
  }

  // Rate limit only the requests that would actually hit the provider.
  const limit = checkTranscriptLimit(ip);
  if (!limit.ok) {
    logAbuse("transcript", ip, { reason: limit.reason, videoId });
    return NextResponse.json(
      {
        error:
          "You've hit the limit for now. Please try again later — this keeps the tool free for everyone.",
        code: "RATE_LIMITED",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // Optional bot challenge (off by default).
  const human = await verifyTurnstile(turnstileToken, ip);
  if (!human) {
    return NextResponse.json(
      { error: "Please complete the verification and try again.", code: "TURNSTILE" },
      { status: 403 },
    );
  }

  try {
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
