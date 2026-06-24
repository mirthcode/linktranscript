import { NextResponse } from "next/server";
import { AiError, runTransform } from "@/lib/ai/transform";
import { config } from "@/lib/config";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { AiTransformType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Lets the client know whether to render the AI panel as enabled.
  return NextResponse.json({ enabled: config.ai.enabled });
}

export async function POST(req: Request) {
  if (!config.ai.enabled) {
    return NextResponse.json(
      {
        error:
          "AI transformations aren't configured. Add an OPENAI_API_KEY to enable them.",
      },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  const limited = rateLimit(`ai:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many AI requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  try {
    const body = await req.json();
    const result = await runTransform({
      type: body.type as AiTransformType,
      transcript: String(body.transcript || ""),
      customInstruction: body.customInstruction
        ? String(body.customInstruction)
        : undefined,
      title: body.title ? String(body.title) : undefined,
    });
    return NextResponse.json({ result });
  } catch (e) {
    if (e instanceof AiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json(
      { error: "Something went wrong running the transformation." },
      { status: 500 },
    );
  }
}
