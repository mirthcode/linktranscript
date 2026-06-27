import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LinkTranscript team.",
};

export default function ContactPage() {
  return (
    <Prose title="Contact">
      <p>
        Have a question, a bug report, or a feature request? We&apos;d love to
        hear from you. Send a message below and we&apos;ll get back to you.
      </p>
      <ContactForm />
      <p className="text-sm text-muted">
        Prefer email? Reach us at{" "}
        <a href="mailto:hello@linktranscript.com">hello@linktranscript.com</a>.
      </p>
    </Prose>
  );
}
