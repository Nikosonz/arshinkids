import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { EnrollForm } from "@/components/enroll-form";
import { getPrograms } from "@/lib/data";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "تماس و ثبت‌نام",
  description: `ثبت‌نام و تماس با ${business.name}. آدرس، شماره تماس و ساعات کاری.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const programs = await getPrograms();

  const info = [
    { icon: MapPin, label: "نشانی", value: business.address.street },
    { icon: Phone, label: "تلفن", value: business.phoneDisplay, href: `tel:${business.phone}`, ltr: true },
    { icon: Mail, label: "ایمیل", value: business.email, href: `mailto:${business.email}`, ltr: true },
    { icon: Clock, label: "ساعات کاری", value: "شنبه تا چهارشنبه، ۸ تا ۱۶" },
  ];

  return (
    <>
      <PageHero
        title="تماس و ثبت‌نام"
        subtitle="فرم زیر را پر کنید تا برای هماهنگی بازدید و ثبت‌نام با شما تماس بگیریم."
      />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-5">
          {/* info */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold">راه‌های ارتباطی</h2>
            <ul className="mt-6 space-y-5">
              {info.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent-hover)]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm text-[var(--text-muted)]">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={item.ltr ? "bidi-plaintext font-medium" : "font-medium"}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="font-medium">{item.value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* form */}
          <div className="lg:col-span-3">
            <EnrollForm
              programs={programs.map((p) => ({ slug: p.slug, title: p.title }))}
            />
          </div>
        </Container>
      </section>

      {/* map */}
      <section className="pb-16">
        <Container>
          <h2 className="mb-4 text-xl font-bold">موقعیت روی نقشه</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${business.geo.lng - 0.006},${business.geo.lat - 0.004},${business.geo.lng + 0.006},${business.geo.lat + 0.004}&layer=mapnik&marker=${business.geo.lat},${business.geo.lng}`}
              width="100%"
              height="400"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              title="موقعیت مهدکودک آرشین"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href={`https://neshan.org/maps/places/@${business.geo.lat},${business.geo.lng},16z`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              مسیریابی با نشان
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
