import Link from "next/link";

const tools = [
  { href: "/youtube-transcript-generator", label: "Transcript Generator" },
  { href: "/youtube-to-text", label: "YouTube to Text" },
  { href: "/youtube-video-summary", label: "Video Summary" },
  { href: "/transcript-to-blog-post", label: "Transcript to Blog" },
  { href: "/srt-to-txt", label: "SRT to TXT" },
];

const company = [
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container-px grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
              P
            </span>
            LinkTranscript
          </div>
          <p className="mt-3 max-w-xs text-sm text-neutral-500">
            Clean transcripts, notes, and summaries from any video — in seconds.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Tools</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            {tools.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="hover:text-ink">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            {company.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="hover:text-ink">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Coming soon</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-400">
            <li>Playlist transcripts</li>
            <li>Saved history</li>
            <li>API access</li>
            <li>Chrome extension</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} LinkTranscript. Not affiliated with YouTube.</p>
          <p>You are responsible for ensuring you have rights to exported content.</p>
        </div>
      </div>
    </footer>
  );
}
