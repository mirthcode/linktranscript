import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { SEO_PAGES } from "@/lib/seo-pages";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.siteUrl.replace(/\/$/, "");
  const staticRoutes = ["", "/blog", "/install", "/contact", "/privacy", "/terms"];
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
    ...BLOG_POSTS.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
