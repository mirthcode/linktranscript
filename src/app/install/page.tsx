import type { Metadata } from "next";
import { InstallClient } from "@/components/InstallClient";

export const metadata: Metadata = {
  title: "Install LinkTranscript",
  description:
    "Add LinkTranscript to your phone or desktop — one-click on Android and desktop, three taps on iPhone. Opens full-screen, no browser bar.",
  alternates: { canonical: "/install" },
};

export default function InstallPage() {
  return (
    <section className="container-px py-14">
      <div className="mx-auto max-w-2xl">
        <span className="mono text-xs uppercase tracking-widest text-accent">
          Add to home screen
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Install LinkTranscript
        </h1>
        <p className="mt-3 text-muted">
          Keep the transcript tool one tap away. Install it like an app — it opens
          full-screen, loads fast, and needs no account.
        </p>

        <div className="mt-8">
          <InstallClient />
        </div>
      </div>
    </section>
  );
}
