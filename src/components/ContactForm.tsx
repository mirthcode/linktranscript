"use client";

import { useState } from "react";

/**
 * Front-end contact form. v1 has no backend mailer wired up — submitting opens
 * the user's email client via a mailto link. Swap for an API route + provider
 * (Resend, Formspree, etc.) when ready.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`LinkTranscript contact from ${name || "a user"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:hello@linktranscript.com?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={submit} className="not-prose space-y-4 rounded-2xl border border-console-border p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-lg border border-console-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          required
          className="rounded-lg border border-console-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How can we help?"
        rows={5}
        required
        className="w-full rounded-lg border border-console-border px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <button type="submit" className="btn-primary">
        Send message
      </button>
    </form>
  );
}
