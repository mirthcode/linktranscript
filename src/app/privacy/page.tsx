import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LinkTranscript handles the URLs you paste and the data we process.",
};

export default function PrivacyPage() {
  return (
    <Prose title="Privacy Policy" updated="June 2026">
      <p>
        This Privacy Policy explains how LinkTranscript (&quot;we&quot;,
        &quot;us&quot;) handles information when you use our transcript tools.
      </p>

      <h2>URLs you paste</h2>
      <p>
        When you submit a YouTube URL, that URL is processed to fetch the
        video&apos;s publicly available captions and generate a transcript. The
        request is handled on our servers and may be sent to YouTube to retrieve
        the caption data.
      </p>

      <h2>Transcripts and storage</h2>
      <p>
        In this version, transcripts are generated on demand and are{" "}
        <strong>not stored permanently</strong>. We may keep a short-lived,
        in-memory cache to speed up repeat requests; cached entries expire
        automatically. If a saved-history feature is enabled in the future, it
        will be clearly opt-in.
      </p>

      <h2>AI transformations</h2>
      <p>
        If AI features are enabled, the transcript text you choose to transform
        is sent to a third-party AI provider (such as OpenAI) to generate the
        requested output. We do not send your data to AI providers unless you
        trigger a transformation.
      </p>

      <h2>Analytics</h2>
      <p>
        We may collect anonymized, aggregate usage events (for example, page
        views and which features are used) to improve the product. This does not
        include the contents of transcripts.
      </p>

      <h2>Cookies</h2>
      <p>
        The core tool works without requiring login cookies. Any future accounts
        or saved-history features may use cookies necessary for that
        functionality.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Reach us via the{" "}
        <a href="/contact">contact page</a>.
      </p>
    </Prose>
  );
}
