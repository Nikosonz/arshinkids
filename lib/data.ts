import "server-only";
import { prisma } from "./db";

/**
 * Read helpers for public pages. Each is wrapped so the site still renders
 * (with empty data) before the Neon DB exists / when it's unreachable —
 * important for the first Vercel deploy. CLAUDE.md §1.
 */

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[data] query failed, returning fallback:", err);
    return fallback;
  }
}

export function getPrograms() {
  return safe(
    () =>
      prisma.program.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
}

export function getProgram(slug: string) {
  return safe(
    () => prisma.program.findFirst({ where: { slug, published: true } }),
    null,
  );
}

export function getStaff() {
  return safe(
    () =>
      prisma.staffMember.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
}

export function getGallery() {
  return safe(
    () => prisma.galleryImage.findMany({ orderBy: { order: "asc" } }),
    [],
  );
}

export function getPosts(limit?: number) {
  return safe(
    () =>
      prisma.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        ...(limit ? { take: limit } : {}),
      }),
    [],
  );
}

export function getPost(slug: string) {
  return safe(
    () => prisma.post.findFirst({ where: { slug, published: true } }),
    null,
  );
}

export function getFaqs() {
  return safe(
    () =>
      prisma.faq.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
}

export function getCourses() {
  return safe(
    () =>
      prisma.course.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        include: { _count: { select: { lessons: true } } },
      }),
    [],
  );
}

export function getCourse(slug: string) {
  return safe(
    () =>
      prisma.course.findFirst({
        where: { slug, published: true },
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: { lessons: { orderBy: { order: "asc" } } },
          },
          lessons: { orderBy: { order: "asc" } },
        },
      }),
    null,
  );
}
