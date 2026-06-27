/**
 * Analytics hooks. Forwards events to Google Analytics 4 (gtag) when present.
 * Pageviews are handled by GA4 Enhanced Measurement (incl. SPA route changes),
 * so `page_view` is not re-sent here to avoid double counting.
 * No paid analytics provider required.
 */

export type AnalyticsEvent =
  | "page_view"
  | "transcript_generated"
  | "transcript_error"
  | "transcript_rate_limited"
  | "copy_clicked"
  | "export_clicked"
  | "search_used"
  | "summary_clicked"
  | "summary_generated"
  | "summary_error"
  | "pwa_install_prompt_seen"
  | "pwa_installed";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return; // client-side only

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, props);
  }

  // GA4 Enhanced Measurement already records page_view (and SPA navigations).
  if (event === "page_view") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }
}
