"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isStandalone } from "@/lib/pwa-install";

/**
 * Compact "Install this tool" CTA. Links to the /install page (which has the
 * one-click button + per-platform instructions). Hidden when already installed.
 */
export function InstallCta({ className = "" }: { className?: string }) {
  const [installed, setInstalled] = useState(false);
  useEffect(() => setInstalled(isStandalone()), []);
  if (installed) return null;

  return (
    <Link
      href="/install"
      className={`inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      Install this tool on your device
    </Link>
  );
}
