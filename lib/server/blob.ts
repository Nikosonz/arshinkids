import "server-only";
import { put } from "@vercel/blob";

/**
 * Upload an image File to Vercel Blob (public access) under `<folder>/<ts>-<name>`.
 * Shared by the gallery upload and the generic media upload action. CLAUDE.md §7.
 * Public on purpose — these are website images loaded directly by visitors.
 */
export async function putImage(folder: string, file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
  const blob = await put(`${folder}/${Date.now()}-${safe}`, file, {
    access: "public",
  });
  return blob.url;
}
