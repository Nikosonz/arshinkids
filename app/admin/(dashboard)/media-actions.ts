"use server";

import { putImage } from "@/lib/server/blob";
import { requireAdmin } from "@/lib/server/auth";

/**
 * Generic image upload used by the staff/news upload widget
 * (components/admin/image-upload.tsx). Returns the public blob URL; the parent
 * form submits it via a hidden field. CLAUDE.md §7/§9.
 */

export interface UploadImageState {
  ok?: boolean;
  url?: string;
  error?: string;
}

const FOLDERS = new Set(["staff", "news", "programs", "courses", "uploads"]);

export async function uploadImage(
  _prev: UploadImageState,
  fd: FormData,
): Promise<UploadImageState> {
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

  const folderRaw = String(fd.get("folder") ?? "uploads");
  const folder = FOLDERS.has(folderRaw) ? folderRaw : "uploads";

  try {
    const url = await putImage(folder, file);
    return { ok: true, url };
  } catch (err) {
    console.error("[media] upload failed:", err);
    return { error: "خطا در آپلود تصویر." };
  }
}
