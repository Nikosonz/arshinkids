"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/auth";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function revalidate() {
  revalidatePath("/admin/staff");
  revalidatePath("/about");
}

function dataFrom(fd: FormData) {
  return {
    name: str(fd, "name"),
    role: str(fd, "role"),
    bio: str(fd, "bio") || null,
    photoUrl: str(fd, "photoUrl") || null,
    order: Number.parseInt(str(fd, "order"), 10) || 0,
    published: fd.get("published") === "on",
  };
}

export async function createStaff(fd: FormData) {
  await requireAdmin();
  await prisma.staffMember.create({ data: dataFrom(fd) });
  revalidate();
  redirect("/admin/staff");
}

export async function updateStaff(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.staffMember.update({ where: { id }, data: dataFrom(fd) });
  revalidate();
  redirect("/admin/staff");
}

export async function deleteStaff(id: string) {
  await requireAdmin();
  await prisma.staffMember.delete({ where: { id } });
  revalidate();
}
