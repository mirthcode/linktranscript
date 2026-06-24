import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { SEO_PAGES } from "@/lib/seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.siteUrl.replace(/\/$/, "");
  const staticRoutes = ["", "/blog", "/contact", "/privacy", "/terms"];
  const now = new Date();

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: r === "" ? 1 : 0.6,
    })),
    ...SEO_PAGES.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
