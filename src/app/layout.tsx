import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { config } from "@/lib/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageView } from "@/components/PageView";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const TITLE = "Free YouTube Transcript Generator — LinkTranscript";
const DESCRIPTION =
  "Free YouTube transcript generator. Paste the link, get the transcript — copy clean text, search long videos, and export TXT, MD, SRT, or VTT. No signup.";

export const viewport: Viewport = {
  themeColor: "#0a0e16",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: TITLE,
    template: "%s · LinkTranscript",
  },
  description: DESCRIPTION,
  applicationName: "LinkTranscript",
  keywords: [
    "youtube transcript",
    "youtube transcript generator",
    "youtube to text",
    "copy youtube transcript",
    "youtube transcript download",
    "srt to txt",
    "vtt to txt",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/favicon-32.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "LinkTranscript",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: config.siteUrl,
    siteName: "LinkTranscript",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
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
        <GoogleAnalytics />
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
