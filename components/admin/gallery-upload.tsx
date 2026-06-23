"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import {
  uploadGalleryImage,
  type UploadState,
} from "@/app/admin/(dashboard)/gallery/actions";
import { Field, Input } from "@/components/admin/ui";

const initial: UploadState = {};

export function GalleryUpload() {
  const [state, action, pending] = useActionState(uploadGalleryImage, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <Field label="تصویر" htmlFor="file" required>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/*"
          required
          className="w-full rounded-xl border border-border bg-[var(--surface)] px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent-subtle)] file:px-4 file:py-1.5 file:text-[var(--accent-hover)]"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="توضیح (اختیاری)" htmlFor="caption">
          <Input id="caption" name="caption" />
        </Field>
        <Field label="ترتیب" htmlFor="order">
          <Input id="order" name="order" type="number" defaultValue={0} />
        </Field>
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
          تصویر با موفقیت آپلود شد.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {pending ? "در حال آپلود…" : "آپلود تصویر"}
      </button>
    </form>
  );
}
