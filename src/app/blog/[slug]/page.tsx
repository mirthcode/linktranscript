import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { relatedPages } from "@/lib/seo-pages";
import { TranscriptInput } from "@/components/TranscriptInput";
import { config } from "@/lib/config";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  const url = `${config.siteUrl}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();
  const related = relatedPages(post.related);
  const dateLabel = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="container-px py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-accent hover:underline">
          ← All guides
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {dateLabel} · {post.readingMinutes} min read
        </p>

        <div className="mt-8 space-y-5 leading-relaxed text-neutral-300">
          {post.body.map((block, i) => {
            if (block.type === "h2")
              return (
                <h2 key={i} className="pt-2 text-xl font-semibold text-ink sm:text-2xl">
                  {block.text}
                </h2>
              );
            if (block.type === "ul")
              return (
                <ul key={i} className="list-disc space-y-2 pl-6">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        {/* Inline CTA */}
        <div className="card mt-10 bg-accent-soft p-6">
          <p className="font-semibold text-ink">Try it on a video</p>
          <p className="mt-1 text-sm text-neutral-300">
            Paste a YouTube link and get a clean, exportable transcript in seconds.
          </p>
          <div className="mt-4">
            <TranscriptInput compact />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold">Related tools</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="btn-ghost btn-sm"
                >
                  {r.h1}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: "LinkTranscript" },
            publisher: { "@type": "Organization", name: "LinkTranscript" },
            mainEntityOfPage: `${config.siteUrl}/blog/${post.slug}`,
          }),
        }}
      />
    </article>
  );
}
