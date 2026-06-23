import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ProgramCard } from "@/components/program-card";
import { getPrograms } from "@/lib/data";

export const metadata: Metadata = {
  title: "برنامه‌ها",
  description:
    "برنامه‌ها و گروه‌های سنی مهدکودک آرشین، از شیرخوارگاه تا پیش‌دبستانی.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHero
        title="برنامه‌ها و گروه‌های سنی"
        subtitle="برای هر سن، برنامه‌ای متناسب با نیازهای رشدی کودک طراحی کرده‌ایم."
      />
      <section className="py-16">
        <Container>
          {programs.length === 0 ? (
            <p className="text-center text-[var(--text-muted)]">
              برنامه‌ها به‌زودی منتشر می‌شوند.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          )}
        </Container>
      </section>
    </>
  );
}
