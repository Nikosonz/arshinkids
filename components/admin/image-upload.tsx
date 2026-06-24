"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "@/app/admin/(dashboard)/media-actions";
import { Field, Input } from "@/components/admin/ui";

/**
 * Image upload widget for use INSIDE another <form> (staff/news). Not a nested
 * form — on file select it calls the `uploadImage` server action directly, then
 * stores the returned URL in a hidden input named `name` so the parent form
 * submits it exactly like the old manual URL field. CLAUDE.md §7.
 */
export function ImageUpload({
  name,
  folder,
  defaultUrl = "",
  label,
  hint,
}: {
  name: string;
  folder: string;
  defaultUrl?: string;
  label: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [manual, setManual] = useState(false);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    startTransition(async () => {
      const res = await uploadImage({}, fd);
      if (res.error) setError(res.error);
      else if (res.url) setUrl(res.url);
    });
  }

  return (
    <Field label={label} hint={hint}>
      {/* the value the parent form submits */}
      <input type="hidden" name={name} value={url} readOnly />

      {url && (
        <div className="mb-3 flex items-start gap-3">
          <Image
            src={url}
            alt=""
            width={96}
            height={96}
            className="h-24 w-24 rounded-xl border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs text-red-700"
          >
            <X className="h-3 w-3" /> حذف
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={onFile}
        disabled={pending}
        className="w-full rounded-xl border border-border bg-[var(--surface)] px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent-subtle)] file:px-4 file:py-1.5 file:text-[var(--accent-hover)] disabled:opacity-60"
      />

      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text-muted)]">
        {pending && (
          <span className="inline-flex items-center gap-1 text-[var(--accent-hover)]">
            <Loader2 className="h-3 w-3 animate-spin" /> در حال آپلود…
          </span>
        )}
        {!pending && (
          <span className="inline-flex items-center gap-1">
            <Upload className="h-3 w-3" /> یک تصویر انتخاب کنید
          </span>
        )}
        <button
          type="button"
          onClick={() => setManual((v) => !v)}
          className="underline"
        >
          یا وارد کردن نشانی
        </button>
      </div>

      {manual && (
        <div className="mt-2">
          <Input
            dir="ltr"
            className="text-right"
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </Field>
  );
}
