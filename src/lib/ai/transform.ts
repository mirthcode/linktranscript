import { config } from "@/lib/config";
import { AiTransformType } from "@/lib/types";
import { SHARED_GUIDANCE, getPrompt } from "./prompts";

export class AiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = "AiError";
  }
}

const MAX_TRANSCRIPT_CHARS = 48000; // keep requests within model context

export async function runTransform(params: {
  type: AiTransformType;
  transcript: string;
  customInstruction?: string;
  title?: string;
}): Promise<string> {
  if (!config.ai.enabled) {
    throw new AiError(
      "AI transformations are not configured. Add OPENAI_API_KEY to enable them.",
      503,
    );
  }

  const def = getPrompt(params.type);
  if (!def) throw new AiError("Unknown transform type.", 400);

  const transcript = params.transcript.slice(0, MAX_TRANSCRIPT_CHARS);
  if (!transcript.trim()) throw new AiError("Transcript is empty.", 400);

  const system = `${SHARED_GUIDANCE}\n\n${def.system}`;
  const userParts = [
    params.title ? `Video title: ${params.title}` : "",
    def.requiresInput && params.customInstruction
      ? `Instruction: ${params.customInstruction}`
      : "",
    "Transcript:",
    transcript,
  ].filter(Boolean);

  const res = await fetch(`${config.ai.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.ai.apiKey}`,
    },
    body: JSON.stringify({
      model: config.ai.model,
      temperature: 0.5,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userParts.join("\n\n") },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429)
      throw new AiError("AI provider is rate-limiting requests. Try again shortly.", 429);
    if (res.status === 401)
      throw new AiError("AI provider rejected the API key.", 502);
    throw new AiError(
      `AI request failed (${res.status}). ${truncate(detail, 200)}`,
      502,
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const out = data.choices?.[0]?.message?.content?.trim();
  if (!out) throw new AiError("AI returned an empty response.", 502);
  return out;
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + "…" : s;
}
