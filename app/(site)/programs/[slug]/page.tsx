import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { ProgramIcon, colorVar } from "@/lib/icons";
import { getProgram } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "برنامه یافت نشد" };
  return {
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/programs/${program.slug}` },
  };
}

export default async function ProgramDetailPage({ params }: Params) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const c = colorVar(program.color);

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <Link
          href="/programs"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent-hover)]"
        >
          همه‌ی برنامه‌ها →
        </Link>

        <div className="flex items-center gap-4">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white"
            style={{ background: c }}
          >
            <ProgramIcon name={program.icon} className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold">{program.title}</h1>
            {program.ageRange && (
              <span className="mt-1 inline-block rounded-full bg-[var(--accent-subtle)] px-3 py-0.5 text-sm font-semibold text-[var(--accent-hover)]">
                {program.ageRange}
              </span>
            )}
          </div>
        </div>

        {program.imageUrl && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl">
            <Image
              src={program.imageUrl}
              alt={program.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <p className="mt-8 text-lg leading-9">{program.summary}</p>
        {program.description && (
          <div className="mt-6 whitespace-pre-line leading-9 text-[var(--text-muted)]">
            {program.description}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            ثبت‌نام در این برنامه
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </article>
  );
}
