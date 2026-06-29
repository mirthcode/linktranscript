"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import {
  setDeferredPrompt,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa-install";

/** App-wide capture of the PWA install prompt + install analytics. */
export function InstallProvider() {
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      track("pwa_install_prompt_seen", {});
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      track("pwa_installed", {});
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return null;
}
