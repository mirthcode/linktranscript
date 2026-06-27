import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TranscriptInput } from "@/components/TranscriptInput";
import { Faq } from "@/components/Faq";
import { AdSlot } from "@/components/AdSlot";
import { SEO_PAGES, getSeoPage, relatedPages } from "@/lib/seo-pages";
import { config } from "@/lib/config";

export function generateStaticParams() {
  return SEO_PAGES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getSeoPage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `${config.siteUrl}/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `${config.siteUrl}/${page.slug}`,
    },
  };
}

export default function SeoLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getSeoPage(params.slug);
  if (!page) notFound();
  const related = relatedPages(page.related);

  return (
    <article>
      {/* Hero + tool */}
      <section className="container-px pt-14 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {page.h1}
          </h1>
          {page.intro.map((p, i) => (
            <p key={i} className="mx-auto mt-4 max-w-2xl text-neutral-300">
              {p}
            </p>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <TranscriptInput />
        </div>
      </section>

      {/* Body content — with an inline ad after the first section */}
      <section className="container-px py-8">
        <div className="prose-none mx-auto max-w-3xl space-y-10">
          {page.sections.map((s, i) => (
            <div key={s.heading}>
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">{s.heading}</h2>
                <p className="mt-3 text-neutral-300">{s.body}</p>
              </div>
              {i === 0 && (
                <div className="mt-10">
                  <AdSlot slot="seo-inline" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Faq items={page.faqs} />

      {/* Internal links */}
      {related.length > 0 && (
        <section className="container-px py-10">
          <h2 className="text-xl font-semibold">Related tools</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/${r.slug}`} className="btn-ghost btn-sm">
                {r.h1}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-px pb-16">
        <div className="card bg-accent-soft p-10 text-center">
          <h2 className="text-2xl font-semibold">Try it on your video</h2>
          <p className="mx-auto mt-2 max-w-xl text-neutral-300">
            Paste a YouTube link and get a clean transcript in seconds.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <TranscriptInput compact />
          </div>
        </div>
      </section>
    </article>
  );
}
