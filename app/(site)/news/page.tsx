import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { getPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "اخبار و اطلاعیه‌ها",
  description: "آخرین اخبار، رویدادها و اطلاعیه‌های مهدکودک آرشین.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        title="اخبار و اطلاعیه‌ها"
        subtitle="از رویدادها، برنامه‌ها و اطلاعیه‌های مهد باخبر شوید."
      />
      <section className="py-16">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-[var(--text-muted)]">
              هنوز خبری منتشر نشده است.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-[var(--surface)] shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-video bg-[var(--accent-subtle)]">
                    {post.coverUrl && (
                      <Image
                        src={post.coverUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {post.publishedAt && (
                      <time className="text-xs text-[var(--text-muted)]">
                        {formatDate(post.publishedAt)}
                      </time>
                    )}
                    <h3 className="mt-1 font-bold">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-7 text-[var(--text-muted)]">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-4 text-sm font-semibold text-[var(--accent-hover)]">
                      ادامه‌ی خبر ←
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
