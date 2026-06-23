import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { getPost } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "خبر یافت نشد" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: post.coverUrl
      ? { images: [{ url: post.coverUrl }] }
      : undefined,
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent-hover)]"
        >
          همه‌ی اخبار →
        </Link>

        {post.publishedAt && (
          <time className="text-sm text-[var(--text-muted)]">
            {formatDate(post.publishedAt)}
          </time>
        )}
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.coverUrl && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div className="mt-8 whitespace-pre-line leading-9">{post.content}</div>
      </Container>
    </article>
  );
}
