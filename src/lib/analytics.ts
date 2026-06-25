/**
 * Analytics hooks. Forwards events to Google Analytics 4 (gtag) when present.
 * Pageviews are handled by GA4 Enhanced Measurement (incl. SPA route changes),
 * so `page_view` is not re-sent here to avoid double counting.
 */

export type AnalyticsEvent =
  | "page_view"
  | "transcript_generated"
  | "export_clicked"
  | "copy_clicked"
  | "ai_transform_clicked"
  | "error_encountered";

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

  // Forward custom events to GA4 if gtag is loaded.
  if (typeof window.gtag === "function") {
    window.gtag("event", event, props);
  }
}
