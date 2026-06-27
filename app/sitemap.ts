import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/business";
import { getPrograms, getPosts, getCourses } from "@/lib/data";

// Fixed build date for static routes — NEVER use new Date() per crawl, or
// <lastmod> churns to "now" every time. CLAUDE.md §8.
const BUILD_DATE = new Date("2026-06-23");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/programs", "/courses", "/about", "/gallery", "/news", "/contact"];

  const base: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: BUILD_DATE,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [programs, posts, courses] = await Promise.all([
    getPrograms(),
    getPosts(),
    getCourses(),
  ]);

  const programUrls: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/programs/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/news/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const courseUrls: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...base, ...programUrls, ...postUrls, ...courseUrls];
}
