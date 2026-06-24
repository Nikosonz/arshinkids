"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/auth";
import { putImage } from "@/lib/server/blob";

function revalidate() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export interface UploadState {
  error?: string;
  ok?: boolean;
}

export async function uploadGalleryImage(
  _prev: UploadState,
  fd: FormData,
): Promise<UploadState> {
  await requireAdmin();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: "توکن آپلود تنظیم نشده است (BLOB_READ_WRITE_TOKEN)." };
  }

  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "فایلی انتخاب نشده است." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "فقط فایل تصویری مجاز است." };
  }

  try {
    const url = await putImage("gallery", file);
    await prisma.galleryImage.create({
      data: {
        url,
        caption: String(fd.get("caption") ?? "").trim() || null,
        order: Number.parseInt(String(fd.get("order") ?? ""), 10) || 0,
      },
    });
    revalidate();
    return { ok: true };
  } catch (err) {
    console.error("[gallery] upload failed:", err);
    return { error: "خطا در آپلود تصویر." };
  }
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return;
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) await del(image.url);
  } catch (err) {
    console.error("[gallery] blob delete failed (non-fatal):", err);
  }
  await prisma.galleryImage.delete({ where: { id } });
  revalidate();
}
