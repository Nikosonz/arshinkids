import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { PlayCircle, LogOut } from "lucide-react";
import { Container } from "@/components/container";
import { getCustomerId } from "@/lib/customer-session";
import { getCustomer, getEnrolledCourses } from "@/lib/data";
import { toFa } from "@/lib/utils";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "حساب کاربری",
  robots: { index: false },
};

export default async function AccountPage() {
  const customerId = await getCustomerId();
  if (!customerId) redirect("/account/login");

  const [customer, courses] = await Promise.all([
    getCustomer(customerId),
    getEnrolledCourses(customerId),
  ]);

  return (
    <div className="py-16">
      <Container className="max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">حساب کاربری</h1>
            <p className="mt-1 text-[var(--text-muted)]">
              {customer?.name || customer?.email}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </form>
        </div>

        <h2 className="mt-10 mb-5 text-lg font-bold">دوره‌های من</h2>
        {courses.length === 0 ? (
          <div className="rounded-3xl border border-border bg-[var(--surface)] p-8 text-center">
            <p className="text-[var(--text-muted)]">
              هنوز دوره‌ای تهیه نکرده‌اید.
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-block rounded-full bg-[var(--accent)] px-6 py-2.5 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              مشاهده‌ی دوره‌ها
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-[var(--surface)] transition-shadow hover:shadow-[var(--shadow-soft)]"
              >
                <div className="relative aspect-video bg-[var(--surface-2)]">
                  {c.coverUrl ? (
                    <Image
                      src={c.coverUrl}
                      alt={c.title}
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
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {toFa(c._count.lessons)} درس
                  </p>
                  <span className="mt-3 text-sm font-semibold text-[var(--accent-hover)]">
                    ادامه‌ی یادگیری →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
