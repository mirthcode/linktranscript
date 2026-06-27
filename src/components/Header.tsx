import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-console-border bg-console-bg/80 backdrop-blur">
      <div className="container-px flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-bold tracking-tight text-white">
            LT
          </span>
          <span>LinkTranscript</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-neutral-300 sm:flex">
          <Link href="/youtube-transcript-generator" className="hover:text-ink">
            Tools
          </Link>
          <Link href="/blog" className="hover:text-ink">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-ink">
            Contact
          </Link>
          <Link href="/#tool" className="btn-primary btn-sm">
            Get transcript
          </Link>
        </nav>
      </div>
    </header>
  );
}
