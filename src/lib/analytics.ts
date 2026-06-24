/**
 * Analytics hooks. Placeholder implementation that logs to the console.
 * Wire up a real provider (PostHog, Plausible, GA, etc.) inside `track()`.
 */

export type AnalyticsEvent =
  | "page_view"
  | "transcript_generated"
  | "export_clicked"
  | "copy_clicked"
  | "ai_transform_clicked"
  | "error_encountered";

export function track(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return; // client-side only for now
  // Placeholder: replace with your analytics provider.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, props);
  }
  // Example for later:
  // window.posthog?.capture(event, props);
}
