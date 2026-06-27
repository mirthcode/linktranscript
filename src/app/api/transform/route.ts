import { NextResponse } from "next/server";

/**
 * DEPRECATED. The broad AI "transform" feature was removed from LinkTranscript.
 * Only an optional, rate-limited Summary feature is planned (see roadmap), built
 * as a separate endpoint. This stub stays disabled.
 *
 * NOTE: src/components/result/TransformPanel.tsx and src/lib/ai/* are leftover,
 * unused files (not imported anywhere, not exposed). Safe to delete locally.
 */
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ enabled: false });
}

export async function POST() {
  return NextResponse.json({ error: "Not available." }, { status: 410 });
}
