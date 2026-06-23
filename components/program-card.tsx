import Link from "next/link";
import { ProgramIcon, colorVar } from "@/lib/icons";

interface ProgramCardProps {
  slug: string;
  title: string;
  summary: string;
  ageRange?: string | null;
  color?: string | null;
  icon?: string | null;
}

export function ProgramCard({
  slug,
  title,
  summary,
  ageRange,
  color,
  icon,
}: ProgramCardProps) {
  const c = colorVar(color);
  return (
    <Link
      href={`/programs/${slug}`}
      className="group flex flex-col rounded-3xl border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
    >
      <span
        className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white"
        style={{ background: c }}
      >
        <ProgramIcon name={icon} className="h-7 w-7" />
      </span>
      <h3 className="mb-1 text-lg font-bold">{title}</h3>
      {ageRange && (
        <span
          className="mb-2 inline-block w-fit rounded-full px-3 py-0.5 text-xs font-semibold"
          style={{ background: "var(--accent-subtle)", color: "var(--accent-hover)" }}
        >
          {ageRange}
        </span>
      )}
      <p className="text-sm leading-7 text-[var(--text-muted)]">{summary}</p>
      <span className="mt-4 text-sm font-semibold text-[var(--accent-hover)]">
        بیشتر بدانید ←
      </span>
    </Link>
  );
}
