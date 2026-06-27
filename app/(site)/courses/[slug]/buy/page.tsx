import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { getCourse } from "@/lib/data";
import { business } from "@/lib/business";
import { formatPrice, decodeSlug } from "@/lib/utils";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "خرید دوره",
    alternates: { canonical: `/courses/${slug}/buy` },
    robots: { index: false },
  };
}

export default async function BuyCoursePage({ params }: Params) {
  const { slug } = await params;
  const course = await getCourse(decodeSlug(slug));
  if (!course || course.accessType !== "PAID") notFound();

  // Payments go live in Phase B once a Zarinpal merchant id is configured.
  const paymentEnabled = Boolean(process.env.ZARINPAL_MERCHANT_ID);

  return (
    <div className="py-20">
      <Container className="max-w-xl">
        <div className="rounded-3xl border border-border bg-[var(--surface)] p-8 text-center">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <div className="mt-3 text-xl font-bold text-[var(--accent-hover)]">
            {course.price ? formatPrice(course.price) : "—"}
          </div>

          {paymentEnabled ? (
            // Phase B wires the real Zarinpal checkout here.
            <p className="mt-6 text-[var(--text-muted)]">
              در حال انتقال به درگاه پرداخت…
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-subtle)] px-4 py-2 text-sm font-semibold text-[var(--accent-hover)]">
                <Clock className="h-4 w-4" />
                خرید آنلاین به‌زودی فعال می‌شود
              </div>
              <p className="leading-8 text-[var(--text-muted)]">
                برای ثبت‌نام در این دوره و هماهنگی پرداخت، فعلاً با ما در تماس
                باشید. به‌زودی امکان خرید مستقیم از سایت فراهم می‌شود.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={business.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
                >
                  واتساپ
                </a>
                <a
                  href={`tel:${business.mobile}`}
                  dir="ltr"
                  className="rounded-full border border-border bg-[var(--surface)] px-6 py-3 font-semibold transition-colors hover:bg-[var(--accent-subtle)]"
                >
                  {business.mobileDisplay}
                </a>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--accent-hover)]"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به صفحه‌ی دوره
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
