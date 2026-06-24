"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TranscriptInput({
  autoFocus = false,
  compact = false,
}: {
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Paste a YouTube URL to get started.");
      return;
    }
    setError("");
    router.push(`/result?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`flex flex-col gap-3 sm:flex-row ${compact ? "" : "sm:gap-2"}`}
      >
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputMode="url"
          placeholder="Paste a YouTube link — e.g. https://youtube.com/watch?v=…"
          aria-label="YouTube URL"
          className="w-full flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button type="submit" className="btn-primary px-6 py-3.5 text-base">
          Get Transcript
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : (
        !compact && (
          <p className="mt-3 text-sm text-neutral-500">
            No signup required for single transcripts. Export clean text in seconds.
          </p>
        )
      )}
    </form>
  );
}
