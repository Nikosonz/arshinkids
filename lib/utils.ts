import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditional className merge — use everywhere instead of template strings. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert Latin digits in a string to Persian digits. */
export function toFa(input: string | number): string {
  const fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/[0-9]/g, (d) => fa[Number(d)]);
}

/**
 * Safely percent-decode a dynamic route slug. Next.js does NOT decode non-ASCII
 * params, so a Persian slug arrives as "%D9%82…" and won't match the stored
 * value — decode it before the DB lookup. No-op for already-decoded slugs.
 */
export function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/** Convert Persian/Arabic-Indic digits in a string to Latin digits. */
export function faToEn(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** Format a Toman price with Persian digits + thousands separators, e.g. "۲۵۰٬۰۰۰ تومان". */
export function formatPrice(toman: number): string {
  return `${toFa(toman.toLocaleString("en-US"))} تومان`;
}

/** Format a date as a Persian (Jalali) date string, e.g. "۱۴۰۳ شهریور ۲". */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
