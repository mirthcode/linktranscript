import type { Metadata } from "next";
import Link from "next/link";
import { SEO_PAGES } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Guides & Tools",
  description:
    "Guides on getting transcripts, notes, and summaries from videos — plus every LinkTranscript tool in one place.",
};

export default function BlogIndexPage() {
  return (
    <section className="container-px py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Guides &amp; tools
        </h1>
        <p className="mt-3 text-neutral-600">
          Every LinkTranscript tool, plus practical guides on turning videos into
          transcripts, notes, and summaries. Long-form articles are on the way —
          start with the tools below.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SEO_PAGES.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h2 className="font-semibold">{p.h1}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-neutral-600">
              {p.metaDescription}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-accent">
              Open tool →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
