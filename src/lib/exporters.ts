import { ExportFormat, TranscriptResult, TranscriptSegment } from "@/lib/types";

/** Format seconds as H:MM:SS or M:SS for display / plain-text exports. */
export function formatTimestamp(seconds: number): string {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Format seconds as HH:MM:SS,mmm (SRT) or HH:MM:SS.mmm (VTT). */
function formatCueTime(seconds: number, sep: "," | "."): string {
  const ms = Math.floor((seconds % 1) * 1000);
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}${sep}${pad(ms, 3)}`;
}

function header(meta: TranscriptResult, comment: boolean): string {
  const lines = [
    `Title: ${meta.meta.title}`,
    meta.meta.author ? `Channel: ${meta.meta.author}` : "",
    `Source: ${meta.meta.sourceUrl}`,
    `Language: ${meta.language}`,
    `Generated: ${new Date(meta.generatedAt).toLocaleString()}`,
    `Words: ${meta.wordCount} · Reading time: ${meta.readingTimeMinutes} min`,
  ].filter(Boolean);
  if (comment) return lines.map((l) => `NOTE ${l}`).join("\n");
  return lines.join("\n");
}

export function toPlainText(
  result: TranscriptResult,
  withTimestamps: boolean,
): string {
  const body = result.segments
    .map((seg) =>
      withTimestamps ? `[${formatTimestamp(seg.start)}] ${seg.text}` : seg.text,
    )
    .join(withTimestamps ? "\n" : "\n");
  return `${header(result, false)}\n\n${body}\n`;
}

export function toMarkdown(
  result: TranscriptResult,
  withTimestamps: boolean,
): string {
  const head = [
    `# ${result.meta.title}`,
    "",
    result.meta.author ? `**Channel:** ${result.meta.author}  ` : "",
    `**Source:** [${result.meta.sourceUrl}](${result.meta.sourceUrl})  `,
    `**Language:** ${result.language}  `,
    `**Generated:** ${new Date(result.generatedAt).toLocaleString()}  `,
    `**Words:** ${result.wordCount} · **Reading time:** ${result.readingTimeMinutes} min`,
    "",
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const body = result.segments
    .map((seg) =>
      withTimestamps
        ? `\`[${formatTimestamp(seg.start)}]\` ${seg.text}`
        : seg.text,
    )
    .join(withTimestamps ? "\n\n" : " ");
  return `${head}${body}\n`;
}

export function toSrt(result: TranscriptResult): string {
  return (
    result.segments
      .map((seg, i) => {
        const end = seg.start + (seg.duration || estimateDur(seg));
        return `${i + 1}\n${formatCueTime(seg.start, ",")} --> ${formatCueTime(
          end,
          ",",
        )}\n${seg.text}\n`;
      })
      .join("\n") + "\n"
  );
}

export function toVtt(result: TranscriptResult): string {
  const cues = result.segments
    .map((seg) => {
      const end = seg.start + (seg.duration || estimateDur(seg));
      return `${formatCueTime(seg.start, ".")} --> ${formatCueTime(
        end,
        ".",
      )}\n${seg.text}\n`;
    })
    .join("\n");
  return `WEBVTT\n\n${header(result, true)}\n\n${cues}\n`;
}

function estimateDur(seg: TranscriptSegment): number {
  // Roughly 0.3s per word when YouTube omits durations.
  return Math.max(1, seg.text.split(/\s+/).length * 0.3);
}

export function exportTranscript(
  result: TranscriptResult,
  format: ExportFormat,
  withTimestamps: boolean,
): { content: string; mime: string; ext: string } {
  switch (format) {
    case "md":
      return {
        content: toMarkdown(result, withTimestamps),
        mime: "text/markdown",
        ext: "md",
      };
    case "srt":
      return { content: toSrt(result), mime: "application/x-subrip", ext: "srt" };
    case "vtt":
      return { content: toVtt(result), mime: "text/vtt", ext: "vtt" };
    case "txt":
    default:
      return {
        content: toPlainText(result, withTimestamps),
        mime: "text/plain",
        ext: "txt",
      };
  }
}

export function safeFilename(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "transcript"
  );
}
