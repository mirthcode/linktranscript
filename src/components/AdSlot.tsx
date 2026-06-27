"use client";

import { useEffect } from "react";

/**
 * Ad slot.
 *
 * v1 behavior:
 *  - In development: shows a tasteful "Ad placement" placeholder box.
 *  - In production WITHOUT an AdSense publisher ID: renders nothing (no empty
 *    boxes shipped to real users while waiting for AdSense approval).
 *  - In production WITH `NEXT_PUBLIC_ADSENSE_CLIENT_ID` set: renders a real
 *    AdSense unit. (The loader script is added in app/layout.tsx, also gated on
 *    the publisher ID.)
 *
 * Do NOT hardcode a publisher ID here — set it via env once AdSense approves you.
 *
 * Placements in use:
 *  - below homepage hero        (slot="home-hero")
 *  - result page sidebar        (slot="result-sidebar")
 *  - below transcript result    (slot="result-below")
 *  - SEO pages after section 1   (slot="seo-inline")
 */

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
const isDev = process.env.NODE_ENV !== "production";

// Map each named placement to an AdSense ad-unit slot ID (fill in after approval).
const AD_UNIT_IDS: Record<string, string> = {
  "home-hero": "",
  "result-sidebar": "",
  "result-below": "",
  "seo-inline": "",
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  slot = "generic",
  className = "",
  height = 90,
}: {
  slot?: string;
  className?: string;
  height?: number;
}) {
  const adUnitId = AD_UNIT_IDS[slot] || "";
  const live = !isDev && !!CLIENT_ID && !!adUnitId;

  useEffect(() => {
    if (!live) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* no-op */
    }
  }, [live]);

  // Production, ads not yet configured → render nothing.
  if (!isDev && !live) return null;

  // Development → dark placeholder so the layout is visible while building.
  if (isDev) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-console-border bg-console-panel ${className}`}
        style={{ minHeight: height }}
        aria-hidden="true"
      >
        <span className="absolute left-2 top-2 mono text-[10px] uppercase tracking-wider text-muted">
          Advertisement
        </span>
        <span className="mono text-xs text-muted/60">ad slot</span>
      </div>
    );
  }

  // Production with a configured AdSense unit — labeled, dark container.
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-console-border bg-console-panel ${className}`}
    >
      <span className="absolute left-2 top-2 z-10 mono text-[10px] uppercase tracking-wider text-muted">
        Advertisement
      </span>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight: height }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={adUnitId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
