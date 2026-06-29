"use client";

/**
 * Tiny app-wide store for the PWA install prompt.
 *
 * The browser fires `beforeinstallprompt` once (on eligible Chromium browsers).
 * We capture it app-wide and stash it here so any page — including /install,
 * reached via client navigation — can trigger the native install dialog.
 */

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
const subscribers = new Set<() => void>();

export function setDeferredPrompt(e: BeforeInstallPromptEvent | null): void {
  deferred = e;
  subscribers.forEach((cb) => cb());
}

export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  return deferred;
}

export function subscribe(cb: () => void): () => void {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export async function triggerInstall(): Promise<
  "accepted" | "dismissed" | "unavailable"
> {
  const d = deferred;
  if (!d) return "unavailable";
  await d.prompt();
  const choice = await d.userChoice;
  setDeferredPrompt(null);
  return choice.outcome;
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS reports as Mac with touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}
