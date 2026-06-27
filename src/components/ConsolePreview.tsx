/**
 * Dark "transcript console" preview shown in the hero.
 * Static, decorative — illustrates the paste → pull → export flow.
 */
const LINES: { t: string; text: string }[] = [
  { t: "00:00", text: "Paste the link" },
  { t: "00:03", text: "Pull the captions" },
  { t: "00:06", text: "Copy or export" },
];

export function ConsolePreview() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-console-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="mono ml-3 text-xs text-muted">transcript</span>
        <span className="mono ml-auto text-xs text-accent">en · ready</span>
      </div>

      {/* Body */}
      <div className="space-y-2 p-5">
        {LINES.map((line) => (
          <div key={line.t} className="flex items-start gap-3">
            <span className="mono shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">
              {line.t}
            </span>
            <span className="mono text-sm text-ink">{line.text}</span>
          </div>
        ))}
        <div className="mono flex items-center gap-2 pt-2 text-xs text-muted">
          <span className="text-accent">$</span>
          <span>export --format txt,md,srt,vtt</span>
          <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-accent" />
        </div>
      </div>
    </div>
  );
}
