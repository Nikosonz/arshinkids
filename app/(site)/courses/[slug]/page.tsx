import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PlayCircle, Lock, ShoppingCart } from "lucide-react";
import { Container } from "@/components/container";
import { VideoEmbed } from "@/components/video-embed";
import { JsonLd } from "@/lib/seo";
import { getCourse } from "@/lib/data";
import { SITE_URL } from "@/lib/business";
import { formatPrice, toFa } from "@/lib/utils";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "دوره یافت نشد" };
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: course.coverUrl
      ? { images: [{ url: course.coverUrl }] }
      : undefined,
  };
}

type Course = NonNullable<Awaited<ReturnType<typeof getCourse>>>;
type Lesson = Course["lessons"][number];

function LessonRow({
  lesson,
  playable,
}: {
  lesson: Lesson;
  playable: boolean;
}) {
  if (!playable) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-[var(--text-muted)]">
        <Lock className="h-4 w-4 shrink-0" />
        <span className="flex-1">{lesson.title}</span>
        <span className="text-xs">قفل</span>
      </div>
    );
  }
  return (
    <details className="group rounded-xl border border-border [&[open]]:bg-[var(--surface-2)]">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 font-medium">
        <PlayCircle className="h-5 w-5 shrink-0 text-[var(--accent)]" />
        <span className="flex-1">{lesson.title}</span>
        {lesson.isFreePreview && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            پیش‌نمایش رایگان
          </span>
        )}
      </summary>
      <div className="px-4 pb-4">
        <VideoEmbed hash={lesson.aparatHash} title={lesson.title} />
      </div>
    </details>
  );
}

export default async function CourseDetailPage({ params }: Params) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const paid = course.accessType === "PAID";
  const isPlayable = (l: Lesson) => !paid || l.isFreePreview;
  const looseLessons = course.lessons.filter((l) => !l.sectionId);

  return (
    <article className="py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.summary,
          url: `${SITE_URL}/courses/${course.slug}`,
          provider: {
            "@type": "Organization",
            name: "مهدکودک آرشین",
            "@id": `${SITE_URL}#organization`,
          },
          ...(paid && course.price
            ? {
                offers: {
                  "@type": "Offer",
                  price: course.price,
                  priceCurrency: "IRT",
                },
              }
            : { isAccessibleForFree: true }),
        }}
      />

      <Container className="max-w-3xl">
        <Link
          href="/courses"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent-hover)]"
        >
          همه‌ی دوره‌ها →
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              paid
                ? "rounded-full bg-[var(--accent-subtle)] px-3 py-0.5 text-sm font-semibold text-[var(--accent-hover)]"
                : "rounded-full bg-green-100 px-3 py-0.5 text-sm font-semibold text-green-700"
            }
          >
            {paid ? "دوره‌ی قابل خرید" : "دوره‌ی رایگان"}
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            {toFa(course.lessons.length)} درس
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold">{course.title}</h1>

        {course.coverUrl && (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-3xl">
            <Image
              src={course.coverUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <p className="mt-6 text-lg leading-9">{course.summary}</p>
        {course.description && (
          <div className="mt-4 whitespace-pre-line leading-9 text-[var(--text-muted)]">
            {course.description}
          </div>
        )}

        {paid && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-[var(--surface-2)] p-6">
            <div>
              <div className="text-sm text-[var(--text-muted)]">قیمت دوره</div>
              <div className="text-xl font-bold text-[var(--accent-hover)]">
                {course.price ? formatPrice(course.price) : "—"}
              </div>
            </div>
            <Link
              href={`/courses/${course.slug}/buy`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 font-bold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              <ShoppingCart className="h-5 w-5" />
              خرید دوره
            </Link>
          </div>
        )}

        {/* curriculum */}
        <h2 className="mt-12 mb-5 text-xl font-bold">سرفصل‌ها</h2>
        <div className="space-y-6">
          {course.sections.map((section) => (
            <div key={section.id}>
              <h3 className="mb-3 font-bold text-[var(--text-muted)]">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.lessons.map((l) => (
                  <LessonRow key={l.id} lesson={l} playable={isPlayable(l)} />
                ))}
              </div>
            </div>
          ))}

          {looseLessons.length > 0 && (
            <div className="space-y-2">
              {looseLessons.map((l) => (
                <LessonRow key={l.id} lesson={l} playable={isPlayable(l)} />
              ))}
            </div>
          )}

          {course.lessons.length === 0 && (
            <p className="text-[var(--text-muted)]">
              درس‌های این دوره به‌زودی اضافه می‌شوند.
            </p>
          )}
        </div>
      </Container>
    </article>
  );
}
