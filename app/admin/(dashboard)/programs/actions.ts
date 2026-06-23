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
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  if (slug) revalidatePath(`/programs/${slug}`);
}

function dataFrom(fd: FormData) {
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);
  return {
    slug,
    title,
    summary: str(fd, "summary"),
    description: str(fd, "description") || null,
    ageRange: str(fd, "ageRange") || null,
    color: str(fd, "color") || "accent",
    icon: str(fd, "icon") || null,
    imageUrl: str(fd, "imageUrl") || null,
    order: Number.parseInt(str(fd, "order"), 10) || 0,
    published: fd.get("published") === "on",
  };
}

export async function createProgram(fd: FormData) {
  await requireAdmin();
  const data = dataFrom(fd);
  await prisma.program.create({ data });
  revalidate(data.slug);
  redirect("/admin/programs");
}

export async function updateProgram(id: string, fd: FormData) {
  await requireAdmin();
  const data = dataFrom(fd);
  await prisma.program.update({ where: { id }, data });
  revalidate(data.slug);
  redirect("/admin/programs");
}

export async function deleteProgram(id: string) {
  await requireAdmin();
  await prisma.program.delete({ where: { id } });
  revalidate();
}
