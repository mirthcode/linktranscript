export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({
  items,
  title = "Frequently asked questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <section className="container-px py-16">
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      <div className="mt-8 divide-y divide-console-border border-y border-console-border">
        {items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {item.q}
              <span className="text-muted transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-neutral-300">{item.a}</p>
          </details>
        ))}
      </div>
      {/* JSON-LD for SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            })),
          }),
        }}
      />
    </section>
  );
}
