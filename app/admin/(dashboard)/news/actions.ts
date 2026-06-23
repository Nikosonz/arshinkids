"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/auth";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-؀-ۿ]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidate(slug?: string) {
  revalidatePath("/admin/news");
  revalidatePath("/news");
  if (slug) revalidatePath(`/news/${slug}`);
}

export async function createPost(fd: FormData) {
  await requireAdmin();
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);
  const published = fd.get("published") === "on";
  await prisma.post.create({
    data: {
      slug,
      title,
      excerpt: str(fd, "excerpt") || null,
      content: str(fd, "content"),
      coverUrl: str(fd, "coverUrl") || null,
      published,
      publishedAt: published ? new Date() : null,
    },
  });
  revalidate(slug);
  redirect("/admin/news");
}

export async function updatePost(id: string, fd: FormData) {
  await requireAdmin();
  const existing = await prisma.post.findUnique({ where: { id } });
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);
  const published = fd.get("published") === "on";
  await prisma.post.update({
    where: { id },
    data: {
      slug,
      title,
      excerpt: str(fd, "excerpt") || null,
      content: str(fd, "content"),
      coverUrl: str(fd, "coverUrl") || null,
      published,
      // set publishedAt the first time it goes live; keep it afterward
      publishedAt: published ? (existing?.publishedAt ?? new Date()) : null,
    },
  });
  revalidate(slug);
  redirect("/admin/news");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidate();
}
