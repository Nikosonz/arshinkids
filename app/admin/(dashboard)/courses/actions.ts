"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/auth";
import { parseAparatHash } from "@/lib/aparat";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function num(fd: FormData, key: string): number {
  return Number.parseInt(str(fd, key), 10) || 0;
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
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  if (slug) revalidatePath(`/courses/${slug}`);
}

// ---------- course ----------

function courseData(fd: FormData) {
  const title = str(fd, "title");
  const accessType = str(fd, "accessType") === "PAID" ? "PAID" : "FREE";
  const price = num(fd, "price");
  return {
    slug: slugify(str(fd, "slug") || title),
    title,
    summary: str(fd, "summary"),
    description: str(fd, "description") || null,
    coverUrl: str(fd, "coverUrl") || null,
    accessType: accessType as "FREE" | "PAID",
    price: accessType === "PAID" && price > 0 ? price : null,
    order: num(fd, "order"),
    published: fd.get("published") === "on",
  };
}

export async function createCourse(fd: FormData) {
  await requireAdmin();
  const data = courseData(fd);
  const course = await prisma.course.create({ data });
  revalidate(data.slug);
  // go straight to the edit page so the admin can add sections + lessons
  redirect(`/admin/courses/${course.id}`);
}

export async function updateCourse(id: string, fd: FormData) {
  await requireAdmin();
  const data = courseData(fd);
  await prisma.course.update({ where: { id }, data });
  revalidate(data.slug);
  redirect("/admin/courses");
}

export async function deleteCourse(id: string) {
  await requireAdmin();
  await prisma.course.delete({ where: { id } }); // cascades sections + lessons
  revalidate();
}

// ---------- sections ----------

export async function addSection(courseId: string, fd: FormData) {
  await requireAdmin();
  const title = str(fd, "title");
  if (title) {
    await prisma.courseSection.create({
      data: { courseId, title, order: num(fd, "order") },
    });
  }
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteSection(courseId: string, id: string) {
  await requireAdmin();
  await prisma.courseSection.delete({ where: { id } }); // lessons.sectionId → null
  revalidatePath(`/admin/courses/${courseId}`);
}

// ---------- lessons ----------

export async function addLesson(courseId: string, fd: FormData) {
  await requireAdmin();
  const title = str(fd, "title");
  const hash = parseAparatHash(str(fd, "aparat"));
  if (title && hash) {
    const sectionId = str(fd, "sectionId") || null;
    await prisma.lesson.create({
      data: {
        courseId,
        sectionId,
        title,
        aparatHash: hash,
        isFreePreview: fd.get("isFreePreview") === "on",
        order: num(fd, "order"),
      },
    });
  }
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteLesson(courseId: string, id: string) {
  await requireAdmin();
  await prisma.lesson.delete({ where: { id } });
  revalidatePath(`/admin/courses/${courseId}`);
}
