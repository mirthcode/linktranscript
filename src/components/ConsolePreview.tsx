/**
 * Dark "transcript console" preview shown in the hero.
 * Static, decorative — shows a realistic transcript excerpt plus the actions
 * you get (copy / export), so it reads like real output, not instructions.
 */
const LINES: { t: string; text: string }[] = [
  { t: "00:00", text: "All right, so let's get into it." },
  { t: "00:04", text: "Here's what we're covering today" },
  { t: "00:08", text: "and why it actually matters." },
  { t: "00:13", text: "First, a quick bit of background…" },
];

const FORMATS = ["TXT", "MD", "SRT", "VTT"];

export function ConsolePreview() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-console-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="mono ml-3 text-xs text-muted">transcript.txt</span>
        <span className="mono ml-auto text-xs text-accent">en · ready</span>
      </div>

      {/* Transcript excerpt */}
      <div className="space-y-2 p-5">
        {LINES.map((line) => (
          <div key={line.t} className="flex items-start gap-3">
            <span className="mono shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">
              {line.t}
            </span>
            <span className="mono text-sm text-ink">{line.text}</span>
          </div>
        ))}
      </div>

      {/* Actions footer */}
      <div className="flex flex-wrap items-center gap-2 border-t border-console-border px-5 py-3">
        <span className="mono text-[10px] uppercase tracking-wider text-muted">
          copy
        </span>
        <span className="mono text-[10px] uppercase tracking-wider text-muted">
          · export
        </span>
        {FORMATS.map((f) => (
          <span
            key={f}
            className="mono rounded border border-console-border px-1.5 py-0.5 text-[10px] text-muted"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
