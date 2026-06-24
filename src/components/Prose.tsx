export function Prose({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-px py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {updated && (
          <p className="mt-2 text-sm text-neutral-500">Last updated: {updated}</p>
        )}
        <div className="mt-8 space-y-5 leading-relaxed text-neutral-700 [&_a]:text-accent [&_a:hover]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </section>
  );
}
