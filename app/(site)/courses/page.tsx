import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Lock } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { getCourses } from "@/lib/data";
import { formatPrice, toFa } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "دوره‌های ویدیویی",
  description:
    "دوره‌های آموزشی ویدیویی آرشین درباره‌ی فرزندپروری و رشد کودک — رایگان و قابل خرید.",
  alternates: { canonical: "/courses" },
};

type CourseCard = Awaited<ReturnType<typeof getCourses>>[number];

function CourseCard({ course }: { course: CourseCard }) {
  const paid = course.accessType === "PAID";
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-[var(--surface)] transition-shadow hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-video bg-[var(--surface-2)]">
        {course.coverUrl ? (
          <Image
            src={course.coverUrl}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
          />
        ) : (
          <div className="grid h-full place-items-center text-[var(--accent)]">
            <PlayCircle className="h-12 w-12" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-[var(--text-muted)]">
          {course.summary}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[var(--text-muted)]">
            {toFa(course._count.lessons)} درس
          </span>
          {paid ? (
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent-hover)]">
              <Lock className="h-4 w-4" />
              {course.price ? formatPrice(course.price) : "قابل خرید"}
            </span>
          ) : (
            <span className="font-semibold text-green-600">رایگان</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const free = courses.filter((c) => c.accessType === "FREE");
  const paid = courses.filter((c) => c.accessType === "PAID");

  return (
    <div className="py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="آموزش"
          title="دوره‌های ویدیویی آرشین"
          subtitle="آموزش‌های کوتاه و کاربردی درباره‌ی فرزندپروری و رشد کودک."
        />

        {courses.length === 0 && (
          <p className="mt-12 text-center text-[var(--text-muted)]">
            به‌زودی دوره‌های آموزشی اینجا منتشر می‌شوند.
          </p>
        )}

        {free.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-bold">دوره‌های رایگان</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {free.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>
        )}

        {paid.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-bold">دوره‌های قابل خرید</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paid.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
