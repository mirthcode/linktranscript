import Script from "next/script";
import { config } from "@/lib/config";

/**
 * Google Analytics 4 (gtag.js) loader.
 *
 * Only renders when NEXT_PUBLIC_GA_ID is set, so dev/preview without the env var
 * stay analytics-free. Pageviews (including SPA route changes) are handled by
 * GA4 Enhanced Measurement; custom events are forwarded from `lib/analytics.ts`.
 */
export function GoogleAnalytics() {
  const id = config.gaId;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
