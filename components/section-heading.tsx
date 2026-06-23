import { cn } from "@/lib/utils";

/** Centered section heading with optional eyebrow + subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <span className="mb-2 inline-block rounded-full bg-[var(--accent-subtle)] px-4 py-1 text-sm font-semibold text-[var(--accent-hover)]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 leading-8 text-[var(--text-muted)]">{subtitle}</p>
      )}
    </div>
  );
}
