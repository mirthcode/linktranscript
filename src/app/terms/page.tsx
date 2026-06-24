import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of LinkTranscript.",
};

export default function TermsPage() {
  return (
    <Prose title="Terms of Use" updated="June 2026">
      <p>
        By using LinkTranscript you agree to these terms. If you do not agree,
        please do not use the service.
      </p>

      <h2>Your responsibility for content</h2>
      <p>
        LinkTranscript extracts publicly available captions from videos.{" "}
        <strong>
          You are solely responsible for ensuring you have the rights to use,
          copy, export, or republish any transcript content
        </strong>{" "}
        you generate. Respect copyright, the original creator&apos;s rights, and
        the platform&apos;s terms of service.
      </p>

      <h2>No affiliation</h2>
      <p>
        LinkTranscript is an independent tool and is{" "}
        <strong>not affiliated with, endorsed by, or sponsored by YouTube or
        Google</strong>. All trademarks belong to their respective owners.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the service to infringe intellectual property rights.</li>
        <li>Do not attempt to overload, scrape, or abuse the service.</li>
        <li>Do not use the service for unlawful purposes.</li>
      </ul>

      <h2>AI output</h2>
      <p>
        AI-generated summaries and drafts may contain errors or omissions.
        Always review and verify AI output before relying on or publishing it.
      </p>

      <h2>No warranty</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any kind.
        Transcript availability depends on the source video&apos;s captions and
        may not always be possible.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, LinkTranscript is not liable for any
        damages arising from your use of the service or any content generated
        through it.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms over time. Continued use after changes
        constitutes acceptance of the updated terms.
      </p>
    </Prose>
  );
}
