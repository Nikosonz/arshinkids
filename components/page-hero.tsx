import { Container } from "./container";

/** Compact page header band for inner pages. */
export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-[var(--surface-2)] py-14">
      <Container className="text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-[var(--text-muted)]">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
