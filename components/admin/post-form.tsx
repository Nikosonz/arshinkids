import Link from "next/link";
import { Field, Input, Textarea, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";

export interface PostFormValues {
  slug?: string;
  title?: string;
  excerpt?: string | null;
  content?: string;
  coverUrl?: string | null;
  published?: boolean;
}

export function PostForm({
  action,
  values = {},
}: {
  action: (fd: FormData) => void | Promise<void>;
  values?: PostFormValues;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="عنوان" htmlFor="title" required>
          <Input id="title" name="title" defaultValue={values.title} required />
        </Field>
        <Field label="نامک (slug)" htmlFor="slug" hint="خالی بگذارید تا خودکار ساخته شود">
          <Input id="slug" name="slug" dir="ltr" className="text-right" defaultValue={values.slug} />
        </Field>
      </div>

      <Field label="خلاصه" htmlFor="excerpt">
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={values.excerpt ?? ""} />
      </Field>

      <Field label="متن خبر" htmlFor="content" required>
        <Textarea id="content" name="content" rows={10} defaultValue={values.content} required />
      </Field>

      <ImageUpload
        name="coverUrl"
        folder="news"
        defaultUrl={values.coverUrl ?? ""}
        label="تصویر کاور"
        hint="اختیاری — یک تصویر آپلود کنید"
      />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={values.published ?? false} className="h-4 w-4" />
        منتشر شود
      </label>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>ذخیره</SubmitButton>
        <Link href="/admin/news" className="text-sm text-[var(--text-muted)]">
          انصراف
        </Link>
      </div>
    </form>
  );
}
