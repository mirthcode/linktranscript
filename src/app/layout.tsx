import type { Metadata } from "next";
import Script from "next/script";
import { config } from "@/lib/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageView } from "@/components/PageView";
import "./globals.css";

const DESCRIPTION =
  "Turn any YouTube video into a clean, exportable transcript with timestamps in seconds. Copy, search, and export as TXT, Markdown, SRT, or VTT. Free, no signup.";

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "LinkTranscript — Paste a video. Get the transcript.",
    template: "%s · LinkTranscript",
  },
  description: DESCRIPTION,
  applicationName: "LinkTranscript",
  keywords: [
    "youtube transcript",
    "video transcript",
    "transcript generator",
    "youtube to text",
    "copy youtube transcript",
    "youtube transcript download",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "LinkTranscript — Paste a video. Get the transcript.",
    description: DESCRIPTION,
    url: config.siteUrl,
    siteName: "LinkTranscript",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkTranscript — Paste a video. Get the transcript.",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <PageView />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Google AdSense loader — only injected once a publisher ID is set. */}
        {config.adsenseClientId ? (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </body>
    </html>
  );
}
