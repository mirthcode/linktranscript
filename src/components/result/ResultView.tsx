"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExportFormat, TranscriptResult } from "@/lib/types";
import { exportTranscript, safeFilename } from "@/lib/exporters";
import { copyText, downloadFile } from "@/lib/browser";
import { track } from "@/lib/analytics";
import { AdSlot } from "@/components/AdSlot";
import { TranscriptBody } from "./TranscriptBody";
import { useYouTubePlayer } from "./useYouTubePlayer";

type Status = "loading" | "ready" | "error";

export function ResultView({ url }: { url: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [lang, setLang] = useState<string | undefined>(undefined);

  const [showTimestamps, setShowTimestamps] = useState(true);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setResult(null);
    fetch("/api/transcript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, lang }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setErrorMsg(data.error || "Something went wrong.");
          setStatus("error");
          track("error_encountered", { scope: "transcript", code: data.code });
          return;
        }
        setResult(data.result);
        setStatus("ready");
        track("transcript_generated", {
          videoId: data.result?.meta?.videoId,
          cached: data.cached,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMsg("We couldn't reach the server. Please try again.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [url, lang]);

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={errorMsg} />;
  if (!result) return null;

  return <ReadyState result={result} url={url} lang={lang} setLang={setLang} {...{ showTimestamps, setShowTimestamps, query, setQuery, copied, setCopied }} />;
}

/* ------------------------------ Ready state ------------------------------ */

function ReadyState({
  result,
  setLang,
  showTimestamps,
  setShowTimestamps,
  query,
  setQuery,
  copied,
  setCopied,
}: {
  result: TranscriptResult;
  url: string;
  lang?: string;
  setLang: (l: string) => void;
  showTimestamps: boolean;
  setShowTimestamps: (b: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  copied: string;
  setCopied: (s: string) => void;
}) {
  const { meta, segments } = result;
  const { containerRef, seekTo } = useYouTubePlayer(meta.videoId);

  const matchCount = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return 0;
    return segments.reduce(
      (n, s) => n + s.text.toLowerCase().split(q).length - 1,
      0,
    );
  }, [query, segments]);

  async function doCopy(withTs: boolean) {
    const text = result.segments
      .map((s) =>
        withTs ? `[${fmt(s.start)}] ${s.text}` : s.text,
      )
      .join(withTs ? "\n" : " ");
    if (await copyText(text)) {
      setCopied(withTs ? "ts" : "clean");
      track("copy_clicked", { withTimestamps: withTs });
      setTimeout(() => setCopied(""), 1500);
    }
  }

  async function copySelection() {
    const sel = typeof window !== "undefined" ? window.getSelection()?.toString() : "";
    if (sel && (await copyText(sel))) {
      setCopied("sel");
      track("copy_clicked", { scope: "selection" });
      setTimeout(() => setCopied(""), 1500);
    } else {
      setCopied("nosel");
      setTimeout(() => setCopied(""), 1500);
    }
  }

  function doExport(format: ExportFormat) {
    const { content, mime, ext } = exportTranscript(result, format, showTimestamps);
    downloadFile(`${safeFilename(meta.title)}.${ext}`, content, mime);
    track("export_clicked", { format });
  }

  return (
    <div className="container-px grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
      {/* Main column */}
      <div className="min-w-0">
        {/* Video + meta */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <div ref={containerRef} className="h-full w-full" />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-snug">{meta.title}</h1>
            {meta.author && (
              <p className="mt-1 text-sm text-neutral-500">{meta.author}</p>
            )}
            <a
              href={meta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block break-all text-sm text-accent hover:underline"
            >
              {meta.sourceUrl}
            </a>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">{result.wordCount.toLocaleString()} words</span>
              <span className="chip">{result.readingTimeMinutes} min read</span>
              <span className="chip">Lang: {result.language}</span>
              {meta.durationSeconds ? (
                <span className="chip">{fmt(meta.durationSeconds)} long</span>
              ) : null}
            </div>
            {result.availableTracks.length > 1 && (
              <div className="mt-4">
                <label className="text-xs font-medium text-neutral-500">
                  Transcript language
                </label>
                <select
                  value={result.language}
                  onChange={(e) => setLang(e.target.value)}
                  className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  {result.availableTracks.map((t) => (
                    <option key={t.languageCode} value={t.languageCode}>
                      {t.label}
                      {t.autoGenerated ? " (auto)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6 card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => doCopy(true)} className="btn-ghost btn-sm">
              {copied === "ts" ? "Copied!" : "Copy with timestamps"}
            </button>
            <button onClick={() => doCopy(false)} className="btn-ghost btn-sm">
              {copied === "clean" ? "Copied!" : "Copy clean text"}
            </button>
            <button onClick={copySelection} className="btn-ghost btn-sm">
              {copied === "sel"
                ? "Copied!"
                : copied === "nosel"
                  ? "Select text first"
                  : "Copy selection"}
            </button>
            <span className="mx-1 h-5 w-px bg-neutral-200" />
            {(["txt", "md", "srt", "vtt"] as ExportFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => doExport(f)}
                className="btn-ghost btn-sm uppercase"
              >
                {f}
              </button>
            ))}
            <span className="ml-auto flex items-center gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={showTimestamps}
                onChange={(e) => setShowTimestamps(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Timestamps
            </span>
          </div>

          {/* Search */}
          <div className="mt-3 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search within transcript…"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {query && (
              <span className="shrink-0 text-xs text-neutral-500">
                {matchCount} match{matchCount === 1 ? "" : "es"}
              </span>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="mt-6 card p-4">
          <div className="ps-scroll max-h-[70vh] overflow-auto pr-1">
            <TranscriptBody
              segments={segments}
              showTimestamps={showTimestamps}
              query={query}
              onSeek={seekTo}
            />
          </div>
        </div>

        <div className="mt-6">
          <AdSlot slot="result-below" />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="card p-4 text-sm text-neutral-600">
          <p className="font-medium text-ink">Transcribe another video</p>
          <p className="mt-1">Paste a new YouTube link to get its transcript.</p>
          <Link href="/#tool" className="btn-primary btn-sm mt-3">
            New transcript
          </Link>
        </div>
        <AdSlot slot="result-sidebar" height={250} className="h-[250px]" />
      </aside>
    </div>
  );
}

/* ------------------------------ States ------------------------------ */

function LoadingState() {
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-accent" />
        <p className="mt-4 font-medium">Fetching transcript…</p>
        <p className="mt-1 text-sm text-neutral-500">
          Pulling captions and cleaning them up.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <h1 className="text-lg font-semibold text-red-800">
          Couldn&apos;t get that transcript
        </h1>
        <p className="mt-2 text-sm text-red-700">{message}</p>
        <Link href="/#tool" className="btn-primary mt-6">
          Try another video
        </Link>
      </div>
    </div>
  );
}

/* helper local to client (avoid importing server-safe formatTimestamp twice) */
function fmt(seconds: number): string {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
