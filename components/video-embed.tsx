import { aparatEmbedUrl } from "@/lib/aparat";

/** Responsive 16:9 Aparat player embed (lazy-loaded). */
export function VideoEmbed({
  hash,
  title,
}: {
  hash: string;
  title?: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
      <iframe
        src={aparatEmbedUrl(hash)}
        title={title ?? "ویدیو"}
        allowFullScreen
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
