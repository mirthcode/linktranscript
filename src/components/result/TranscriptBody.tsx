"use client";

import { useMemo } from "react";
import { TranscriptSegment } from "@/lib/types";
import { formatTimestamp } from "@/lib/exporters";
import { copyText } from "@/lib/browser";
import { track } from "@/lib/analytics";

interface Section {
  start: number;
  end: number;
  segments: { seg: TranscriptSegment; index: number }[];
}

const SECTION_WINDOW = 120; // seconds per collapsible section

export function TranscriptBody({
  segments,
  showTimestamps,
  query,
  onSeek,
}: {
  segments: TranscriptSegment[];
  showTimestamps: boolean;
  query: string;
  onSeek: (seconds: number) => void;
}) {
  const sections = useMemo<Section[]>(() => {
    const out: Section[] = [];
    segments.forEach((seg, index) => {
      const bucket = Math.floor(seg.start / SECTION_WINDOW);
      const last = out[out.length - 1];
      if (!last || Math.floor(last.start / SECTION_WINDOW) !== bucket) {
        out.push({ start: seg.start, end: seg.start + seg.duration, segments: [] });
      }
      const cur = out[out.length - 1];
      cur.end = seg.start + seg.duration;
      cur.segments.push({ seg, index });
    });
    return out;
  }, [segments]);

  async function copyQuote(text: string) {
    if (await copyText(text)) track("copy_clicked", { scope: "quote" });
  }

  return (
    <div>
      {sections.map((section, si) => (
        <details key={si} open className="group border-b border-console-border">
          <summary className="sticky top-0 z-10 flex cursor-pointer list-none items-center gap-2 bg-console-panel/90 py-2 text-xs font-medium text-muted backdrop-blur">
            <span className="transition group-open:rotate-90">▸</span>
            {formatTimestamp(section.start)} – {formatTimestamp(section.end)}
          </summary>
          <div className="pb-3">
            {section.segments.map(({ seg, index }) => (
              <div
                key={index}
                className="group/row flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-console-raised"
              >
                {showTimestamps && (
                  <button
                    onClick={() => onSeek(seg.start)}
                    className="mt-0.5 shrink-0 rounded bg-accent-soft px-2 py-1 font-mono text-xs text-accent hover:bg-accent hover:text-white"
                    title="Jump to this moment"
                  >
                    {formatTimestamp(seg.start)}
                  </button>
                )}
                <p className="flex-1 leading-relaxed text-ink">
                  {highlight(seg.text, query)}
                </p>
                {/* Always visible on touch; hover-reveal on desktop */}
                <button
                  onClick={() => copyQuote(seg.text)}
                  className="mt-0.5 shrink-0 rounded px-2 py-1 text-xs text-muted transition hover:bg-console-raised hover:text-ink sm:opacity-0 sm:group-hover/row:opacity-100"
                  title="Copy this line"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

/** Wrap query matches in <mark> for highlighting. Case-insensitive. */
function highlight(text: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return text;
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="ps-hl">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
