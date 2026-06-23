import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {action && (
        <Link
          href={action.href}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-[var(--surface)] p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-border bg-[var(--surface)] px-4 py-2.5 outline-none transition-colors focus:border-[var(--accent)]";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea {...props} className={cn(inputBase, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputBase, props.className)} />;
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-[var(--accent)] px-6 py-2.5 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
    >
      {children}
    </button>
  );
}
