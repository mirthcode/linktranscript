import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LinkTranscript",
    short_name: "LinkTranscript",
    description:
      "Free YouTube transcript generator. Paste the link, get the transcript — copy, search, and export TXT, MD, SRT, or VTT.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0a0e16",
    theme_color: "#0a0e16",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/brand/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
