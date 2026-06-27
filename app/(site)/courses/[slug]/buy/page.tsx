import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Clock, ArrowRight, ShoppingCart, AlertCircle } from "lucide-react";
import { Container } from "@/components/container";
import { getCourse, isEnrolled } from "@/lib/data";
import { getCustomerId } from "@/lib/customer-session";
import { isZarinpalEnabled } from "@/lib/server/zarinpal";
import { business } from "@/lib/business";
import { formatPrice, decodeSlug } from "@/lib/utils";
import { startCheckout } from "./actions";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };
type Search = { searchParams: Promise<{ status?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "خرید دوره",
    alternates: { canonical: `/courses/${slug}/buy` },
    robots: { index: false },
  };
}

export default async function BuyCoursePage({
  params,
  searchParams,
}: Params & Search) {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  const course = await getCourse(decoded);
  if (!course || course.accessType !== "PAID") notFound();

  const customerId = await getCustomerId();

  // already owns it → straight to the course
  if (customerId && (await isEnrolled(customerId, course.id))) {
    redirect(`/courses/${course.slug}`);
  }

  const enabled = isZarinpalEnabled();
  const { status } = await searchParams;
  const failed = status === "failed" || status === "error";

  return (
    <div className="py-20">
      <Container className="max-w-xl">
        <div className="rounded-3xl border border-border bg-[var(--surface)] p-8 text-center">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <div className="mt-3 text-xl font-bold text-[var(--accent-hover)]">
            {course.price ? formatPrice(course.price) : "—"}
          </div>

          {failed && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.
            </p>
          )}

          {enabled ? (
            <div className="mt-6 space-y-4">
              {customerId ? (
                <form action={startCheckout}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="slug" value={course.slug} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 font-bold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    پرداخت و خرید دوره
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-[var(--text-muted)]">
                    برای خرید این دوره ابتدا وارد حساب کاربری شوید.
                  </p>
                  <Link
                    href={`/account/login?next=/courses/${encodeURIComponent(course.slug)}/buy`}
                    className="inline-block rounded-full bg-[var(--accent)] px-8 py-3 font-bold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
                  >
                    ورود / ثبت‌نام
                  </Link>
                </div>
              )}
            </div>
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
