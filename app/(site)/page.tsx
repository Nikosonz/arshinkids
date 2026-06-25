import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  Apple,
  HeartHandshake,
  ArrowLeft,
} from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ProgramCard } from "@/components/program-card";
import { getPrograms, getFaqs } from "@/lib/data";
import { business } from "@/lib/business";
import { JsonLd, localBusinessSchema, faqSchema } from "@/lib/seo";

const features = [
  {
    icon: ShieldCheck,
    title: "محیط امن و بهداشتی",
    text: "فضای استاندارد، ضدعفونی روزانه و مراقبت دائم برای آرامش خاطر شما.",
  },
  {
    icon: GraduationCap,
    title: "مربیان آموزش‌دیده",
    text: "تیمی باتجربه و مهربان که رشد و یادگیری کودک را هدایت می‌کنند.",
  },
  {
    icon: Apple,
    title: "تغذیه‌ی سالم",
    text: "وعده‌های غذایی متنوع و میان‌وعده زیر نظر کارشناس تغذیه.",
  },
  {
    icon: HeartHandshake,
    title: "آموزش بازی‌محور",
    text: "یادگیری از طریق بازی، خلاقیت و فعالیت‌های گروهی شاد.",
  },
];

export default async function HomePage() {
  const [programs, faqs] = await Promise.all([getPrograms(), getFaqs()]);

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}

      {/* hero */}
      <section className="relative overflow-hidden bg-[var(--surface-2)]">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="mb-4 inline-block rounded-full bg-[var(--accent-subtle)] px-4 py-1 text-sm font-semibold text-[var(--accent-hover)]">
              {business.tagline}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              جایی امن و شاد برای رشد و شکوفایی کودک شما
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-9 text-[var(--text-muted)]">
              در {business.name}، واقع در جهانشهر کرج، با آموزش بازی‌محور، مراقبت
              دلسوزانه و فضایی پر از مهر، کودکان را برای آینده‌ای روشن آماده
              می‌کنیم.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
              >
                ثبت‌نام کودک
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center rounded-full border border-border bg-[var(--surface)] px-6 py-3 font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-subtle)]"
              >
                مشاهده‌ی برنامه‌ها
              </Link>
            </div>
          </div>

          {/* decorative hero panel */}
          <div className="relative hidden md:block">
            <div className="aspect-square rounded-[3rem] bg-[var(--accent-subtle)]" />
            <div
              className="absolute -bottom-6 -left-6 h-32 w-32 rounded-[2rem]"
              style={{ background: "var(--fun-yellow)" }}
            />
            <div
              className="absolute -top-6 right-10 h-20 w-20 rounded-full"
              style={{ background: "var(--secondary)" }}
            />
            <div className="absolute inset-0 grid place-items-center text-[7rem]">
              🧸
            </div>
          </div>
        </Container>
      </section>

      {/* features */}
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="چرا آرشین؟"
            title="آنچه ما را متفاوت می‌کند"
            subtitle="هر آنچه برای رشد سالم و شاد کودک شما لازم است، در یک مکان."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-border bg-[var(--surface)] p-6 text-center"
              >
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent-hover)]">
                  <f.icon className="h-7 w-7" />
                </span>
                <h3 className="mb-2 font-bold">{f.title}</h3>
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* programs */}
      {programs.length > 0 && (
        <section className="bg-[var(--surface-2)] py-16 md:py-20">
          <Container>
            <SectionHeading
              eyebrow="برنامه‌های ما"
              title="گروه‌های سنی و دوره‌ها"
              subtitle="برنامه‌ای مناسب هر سن، از شیرخوارگاه تا پیش‌دبستانی."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <ProgramCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  summary={p.summary}
                  ageRange={p.ageRange}
                  color={p.color}
                  icon={p.icon}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* faq */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-20">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="سؤالات متداول"
              title="پاسخ پرسش‌های شما"
            />
            <div className="mt-10 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-2xl border border-border bg-[var(--surface)] p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {faq.question}
                    <span className="text-[var(--accent)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-8 text-[var(--text-muted)]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* cta band */}
      <section className="py-16">
        <Container>
          <div className="rounded-[2.5rem] bg-[var(--accent)] px-8 py-14 text-center text-[var(--accent-contrast)]">
            <h2 className="text-2xl font-bold sm:text-3xl">
              آماده‌اید کودک‌تان را ثبت‌نام کنید؟
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-8 opacity-90">
              فرم ثبت‌نام را پر کنید تا همکاران ما برای هماهنگی بازدید با شما تماس
              بگیرند.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-7 py-3 font-bold text-[var(--accent-hover)] transition-transform hover:scale-105"
            >
              شروع ثبت‌نام
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
