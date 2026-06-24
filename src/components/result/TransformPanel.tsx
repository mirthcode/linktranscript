"use client";

import { useEffect, useState } from "react";
import { PROMPT_OPTIONS } from "@/lib/ai/prompts";
import { AiTransformType } from "@/lib/types";
import { track } from "@/lib/analytics";
import { copyText } from "@/lib/browser";

export function TransformPanel({
  transcript,
  title,
}: {
  transcript: string;
  title: string;
}) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [active, setActive] = useState<AiTransformType>("summary");
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/transform")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  const activeDef = PROMPT_OPTIONS.find((p) => p.type === active);

  async function run() {
    setLoading(true);
    setError("");
    setOutput("");
    track("ai_transform_clicked", { type: active });
    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: active,
          transcript,
          title,
          customInstruction: active === "custom" ? custom : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed.");
      setOutput(data.result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      track("error_encountered", { scope: "ai_transform", message: msg });
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    if (await copyText(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Transform Transcript</h2>
        <span className="chip">AI</span>
      </div>

      {enabled === false && (
        <p className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
          AI transformations aren&apos;t configured. Add an{" "}
          <code className="rounded bg-neutral-200 px-1">OPENAI_API_KEY</code> to
          enable them. Transcript extraction and exports still work without it.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {PROMPT_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setActive(opt.type)}
            disabled={enabled === false}
            title={opt.description}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              active === opt.type
                ? "border-accent bg-accent-soft text-accent"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            } disabled:opacity-50`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {activeDef?.requiresInput && (
        <textarea
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Enter your instruction — e.g. 'List every statistic mentioned, with its context.'"
          disabled={enabled === false}
          rows={3}
          className="mt-3 w-full rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      )}

      <button
        onClick={run}
        disabled={enabled === false || loading || (active === "custom" && !custom.trim())}
        className="btn-primary mt-4"
      >
        {loading ? "Generating…" : `Generate ${activeDef?.label}`}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {loading && (
        <div className="mt-4 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-3 animate-pulse rounded bg-neutral-200"
              style={{ width: `${90 - i * 12}%` }}
            />
          ))}
        </div>
      )}

      {output && !loading && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500">Result</span>
            <button onClick={copyOutput} className="btn-ghost btn-sm">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="ps-scroll max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed">
            {output}
          </div>
        </div>
      )}
    </section>
  );
}
