"use client";

import { useEffect, useState } from "react";
import {
  getDeferredPrompt,
  isIOS,
  isStandalone,
  subscribe,
  triggerInstall,
} from "@/lib/pwa-install";

export function InstallClient() {
  const [canPrompt, setCanPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIOS());
    setCanPrompt(!!getDeferredPrompt());
    return subscribe(() => setCanPrompt(!!getDeferredPrompt()));
  }, []);

  async function onInstall() {
    const outcome = await triggerInstall();
    if (outcome === "accepted") setStatus("Installing… check your home screen.");
    else if (outcome === "dismissed") setStatus("No problem — you can install anytime.");
    else
      setStatus(
        "Your browser didn't offer a one-click install. Use the menu steps below.",
      );
  }

  if (installed) {
    return (
      <div className="card border-accent/40 bg-accent-soft p-6">
        <p className="font-semibold text-ink">✓ LinkTranscript is installed</p>
        <p className="mt-1 text-sm text-muted">
          You&apos;re all set — open it from your home screen anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* One-click (Android + desktop Chrome/Edge) */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Android &amp; desktop (Chrome / Edge)</h2>
        <p className="mt-1 text-sm text-muted">
          One click — your browser handles the rest.
        </p>
        <button
          onClick={onInstall}
          disabled={!canPrompt}
          className="btn-primary mt-4 py-3 text-base disabled:opacity-50"
        >
          Install LinkTranscript
        </button>
        {!canPrompt && (
          <p className="mt-3 text-sm text-muted">
            If the button is greyed out, your browser still lets you install
            manually: open the browser <span className="text-ink">menu</span> (⋮)
            and choose <span className="text-ink">Install app</span> or{" "}
            <span className="text-ink">Add to Home screen</span>.
          </p>
        )}
        {status && <p className="mt-3 text-sm text-accent">{status}</p>}
      </section>

      {/* iPhone / iPad (Safari) */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold">iPhone &amp; iPad (Safari)</h2>
        <p className="mt-1 text-sm text-muted">
          Apple doesn&apos;t allow one-click install, but it takes three taps:
        </p>
        <ol className="mt-4 space-y-3 text-sm text-neutral-300">
          <li className="flex gap-3">
            <span className="mono shrink-0 rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">
              1
            </span>
            Open <span className="text-ink">linktranscript.com</span> in{" "}
            <span className="text-ink">Safari</span> (not Chrome).
          </li>
          <li className="flex gap-3">
            <span className="mono shrink-0 rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">
              2
            </span>
            Tap the <span className="text-ink">Share</span> button (square with an
            up-arrow).
          </li>
          <li className="flex gap-3">
            <span className="mono shrink-0 rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">
              3
            </span>
            Scroll down, tap <span className="text-ink">Add to Home Screen</span>,
            then <span className="text-ink">Add</span>.
          </li>
        </ol>
        {ios && (
          <p className="mt-4 mono text-xs text-accent">
            ↳ You&apos;re on iOS — use the steps above.
          </p>
        )}
      </section>

      <p className="text-sm text-muted">
        Once installed, LinkTranscript opens full-screen from your home screen —
        no browser bar, just the tool.
      </p>
    </div>
  );
}
