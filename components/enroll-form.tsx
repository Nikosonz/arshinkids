"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { enrollSchema, type EnrollInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-border bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]";
const labelClass = "mb-1 block text-sm font-medium";
const errorClass = "mt-1 text-xs text-red-600";

export function EnrollForm({ programs }: { programs: { slug: string; title: string }[] }) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnrollInput>({ resolver: zodResolver(enrollSchema) });

  async function onSubmit(values: EnrollInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "خطا در ارسال فرم");
      }
      setDone(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "خطای ناشناخته");
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-[var(--surface)] p-10 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--fun-green)]" />
        <h3 className="mt-4 text-xl font-bold">درخواست شما ثبت شد</h3>
        <p className="mt-2 leading-8 text-[var(--text-muted)]">
          از اعتماد شما سپاسگزاریم. همکاران ما به‌زودی برای هماهنگی با شما تماس
          می‌گیرند.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-3xl border border-border bg-[var(--surface)] p-6 sm:p-8"
    >
      {/* honeypot — hidden from users */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0"
        aria-hidden
        {...register("website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="parentName">
            نام والد <span className="text-red-600">*</span>
          </label>
          <input id="parentName" className={fieldClass} {...register("parentName")} />
          {errors.parentName && (
            <p className={errorClass}>{errors.parentName.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            شماره تماس <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            inputMode="tel"
            dir="ltr"
            className={cn(fieldClass, "text-right")}
            {...register("phone")}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="childName">
            نام کودک
          </label>
          <input id="childName" className={fieldClass} {...register("childName")} />
        </div>

        <div>
          <label className={labelClass} htmlFor="childBirthYear">
            سال تولد کودک (شمسی)
          </label>
          <input
            id="childBirthYear"
            inputMode="numeric"
            placeholder="مثلاً ۱۴۰۱"
            className={fieldClass}
            {...register("childBirthYear")}
          />
          {errors.childBirthYear && (
            <p className={errorClass}>{errors.childBirthYear.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="program">
            برنامه‌ی موردنظر
          </label>
          <select id="program" className={fieldClass} defaultValue="" {...register("program")}>
            <option value="">انتخاب کنید…</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="message">
            توضیحات
          </label>
          <textarea
            id="message"
            rows={4}
            className={fieldClass}
            {...register("message")}
          />
          {errors.message && <p className={errorClass}>{errors.message.message}</p>}
        </div>
      </div>

      {serverError && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "در حال ارسال…" : "ارسال درخواست ثبت‌نام"}
      </button>
    </form>
  );
}
