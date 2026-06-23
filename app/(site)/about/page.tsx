import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getStaff } from "@/lib/data";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `درباره ${business.name} و تیم مربیان آن.`,
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: ShieldCheck,
    title: "ایمنی و آرامش",
    text: "سلامت و امنیت کودکان اولویت اول ماست.",
  },
  {
    icon: Sparkles,
    title: "خلاقیت و بازی",
    text: "یادگیری در فضایی شاد و خلاقانه اتفاق می‌افتد.",
  },
  {
    icon: Users,
    title: "احترام و مهر",
    text: "هر کودک منحصربه‌فرد است و با عشق همراهی می‌شود.",
  },
];

export default async function AboutPage() {
  const staff = await getStaff();

  return (
    <>
      <PageHero
        title={`درباره ${business.name}`}
        subtitle="با ماموریت، ارزش‌ها و تیم مهربان ما بیشتر آشنا شوید."
      />

      {/* story */}
      <section className="py-16">
        <Container className="max-w-3xl text-center leading-9 text-[var(--text-muted)]">
          <p>
            {business.name} با هدف فراهم‌کردن محیطی امن، شاد و آموزشی برای کودکان
            تأسیس شده است. ما باور داریم سال‌های نخست زندگی، پایه‌ی شخصیت و
            یادگیری کودک را می‌سازد؛ به همین دلیل با برنامه‌ای بازی‌محور و مربیانی
            دلسوز، در کنار خانواده‌ها هستیم تا کودکان با اعتمادبه‌نفس و شادی رشد
            کنند.
            {/* TODO(owner): متن واقعی معرفی مهد را جایگزین کنید. */}
          </p>
        </Container>
      </section>

      {/* values */}
      <section className="bg-[var(--surface-2)] py-16">
        <Container>
          <SectionHeading eyebrow="ارزش‌های ما" title="آنچه به آن باور داریم" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-3xl border border-border bg-[var(--surface)] p-6 text-center"
              >
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent-hover)]">
                  <v.icon className="h-7 w-7" />
                </span>
                <h3 className="mb-2 font-bold">{v.title}</h3>
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* staff */}
      {staff.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading
              eyebrow="تیم ما"
              title="مربیان و کارکنان"
              subtitle="افرادی که هر روز با مهر در کنار کودکان شما هستند."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {staff.map((m) => (
                <div
                  key={m.id}
                  className="rounded-3xl border border-border bg-[var(--surface)] p-6 text-center"
                >
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-[var(--accent-subtle)]">
                    {m.photoUrl ? (
                      <Image
                        src={m.photoUrl}
                        alt={m.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-3xl text-[var(--accent-hover)]">
                        {m.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold">{m.name}</h3>
                  <p className="text-sm text-[var(--accent-hover)]">{m.role}</p>
                  {m.bio && (
                    <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                      {m.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
