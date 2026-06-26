import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { SEO_PAGES } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Guides & Tools",
  description:
    "Guides on turning videos into transcripts, notes, and summaries — plus every LinkTranscript tool in one place.",
};

export default function BlogIndexPage() {
  return (
    <section className="container-px py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Guides &amp; tools
        </h1>
        <p className="mt-3 text-neutral-600">
          Practical guides on getting transcripts, notes, and summaries from
          videos — plus quick access to every LinkTranscript tool.
        </p>
      </div>

      {/* Articles */}
      <h2 className="mt-12 text-xl font-semibold">Latest guides</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {post.readingMinutes} min
            </p>
            <h3 className="mt-2 font-semibold leading-snug">{post.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-neutral-600">
              {post.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-accent">
              Read guide →
            </span>
          </Link>
        ))}
      </div>

      {/* Tools */}
      <h2 className="mt-14 text-xl font-semibold">All tools</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SEO_PAGES.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <h3 className="font-semibold">{p.h1}</h3>
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
