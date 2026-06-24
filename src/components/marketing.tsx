/* ------------------------------ How it works ------------------------------ */

const steps = [
  {
    n: "1",
    title: "Paste a video link",
    body: "Drop any YouTube URL into the box. Watch pages, youtu.be links, and Shorts all work.",
  },
  {
    n: "2",
    title: "Get the transcript",
    body: "We pull the captions instantly and clean them up — timestamps included by default.",
  },
  {
    n: "3",
    title: "Copy, export, or transform",
    body: "Copy clean text, export TXT/MD/SRT/VTT, or turn it into notes, summaries, and posts.",
  },
];

export function HowItWorks() {
  return (
    <section className="container-px py-16">
      <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="card p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
              {s.n}
            </div>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Feature grid ------------------------------ */

const features = [
  ["Instant transcripts", "Captions extracted in seconds, cleaned and readable."],
  ["Timestamp controls", "Toggle timestamps on or off, click to jump the video."],
  ["One-click copy", "Copy with or without timestamps, or copy a single quote."],
  ["Clean text export", "Tidy TXT with title, source, and generation date."],
  ["Markdown export", "Drop straight into Notion, Obsidian, or your docs."],
  ["SRT / VTT export", "Subtitle-ready files for editors and players."],
  ["Transcript search", "Find any word instantly with highlighted matches."],
  ["Clickable timestamps", "Jump the embedded video to any line in one click."],
  ["No signup", "Use it free, instantly — no account or login required."],
  ["Playlist support", "Bulk playlist transcripts — coming soon.", true],
  ["Saved history", "Keep a library of past transcripts — coming soon.", true],
  ["AI summaries & notes", "Summaries, study notes, and post drafts — coming soon.", true],
] as const;

export function FeatureGrid() {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container-px">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Everything you need from a transcript tool
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, body, soon]) => (
            <div key={title} className="card p-5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{title}</h3>
                {soon ? <span className="chip">Soon</span> : null}
              </div>
              <p className="mt-2 text-sm text-neutral-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Use cases ------------------------------ */

const useCases = [
  ["Researchers", "Quote sources precisely and search across long talks."],
  ["Students", "Turn lectures into study guides and review questions."],
  ["Creators", "Repurpose videos into blogs, threads, and posts."],
  ["Operators", "Pull action items and meeting notes from recordings."],
];

export function UseCases() {
  return (
    <section className="container-px py-16">
      <h2 className="text-2xl font-semibold sm:text-3xl">
        Built for researchers, students, creators, and operators
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {useCases.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Export formats ------------------------------ */

const formats = [
  ["TXT", "Plain text with a clean header and optional timestamps."],
  ["Markdown", "Formatted for docs and note apps."],
  ["SRT", "Standard subtitle format for video editors."],
  ["VTT", "Web-native captions for HTML5 players."],
];

export function ExportFormats() {
  return (
    <section className="bg-ink py-16 text-white">
      <div className="container-px">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Export in the format you actually use
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-300">
          Every export includes the video title, source URL, language, and the
          date it was generated.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-ink-soft p-6">
              <div className="text-lg font-semibold">.{title.toLowerCase()}</div>
              <p className="mt-2 text-sm text-neutral-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Trust bar ------------------------------ */

export function TrustBar() {
  const items = [
    "No signup required for single transcripts",
    "Export clean text in seconds",
    "Timestamps you can click to jump the video",
  ];
  return (
    <div className="border-y border-neutral-200 bg-neutral-50">
      <div className="container-px flex flex-col items-center gap-2 py-4 text-sm text-neutral-600 sm:flex-row sm:justify-center sm:gap-8">
        {items.map((i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-accent">✓</span>
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
