import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/business";

/** robots.txt — allow AI crawlers, block admin/api. CLAUDE.md §8. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "*",
          "GPTBot",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
