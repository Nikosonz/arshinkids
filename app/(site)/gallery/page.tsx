import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "گالری",
  description: "تصاویری از فضا، فعالیت‌ها و لحظه‌های شاد مهدکودک آرشین.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <>
      <PageHero
        title="گالری تصاویر"
        subtitle="نگاهی به فضا و لحظه‌های شاد کودکان در آرشین."
      />
      <section className="py-16">
        <Container>
          {images.length === 0 ? (
            <p className="text-center text-[var(--text-muted)]">
              تصاویر به‌زودی اضافه می‌شوند.
            </p>
          ) : (
            <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
              {images.map((img) => (
                <figure
                  key={img.id}
                  className="overflow-hidden rounded-2xl border border-border bg-[var(--surface)]"
                >
                  <Image
                    src={img.url}
                    alt={img.caption || "گالری آرشین"}
                    width={500}
                    height={500}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {img.caption && (
                    <figcaption className="p-3 text-center text-sm text-[var(--text-muted)]">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
