import Image from "next/image";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteGalleryImage } from "./actions";

export const dynamic = "force-dynamic";

async function getGalleryAdmin() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminGalleryPage() {
  const images = await getGalleryAdmin();

  return (
    <div className="space-y-6">
      <AdminHeader title="گالری تصاویر" />

      <Card>
        <h2 className="mb-4 font-bold">افزودن تصویر</h2>
        <GalleryUpload />
      </Card>

      {images.length === 0 ? (
        <Card>
          <p className="text-[var(--text-muted)]">هنوز تصویری آپلود نشده است.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <Card key={img.id} className="p-3">
              <div className="relative mb-2 aspect-square overflow-hidden rounded-xl">
                <Image
                  src={img.url}
                  alt={img.caption || "تصویر گالری"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              {img.caption && (
                <p className="mb-1 truncate text-xs text-[var(--text-muted)]">
                  {img.caption}
                </p>
              )}
              <DeleteButton
                action={deleteGalleryImage.bind(null, img.id)}
                confirmText="این تصویر حذف شود؟"
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
