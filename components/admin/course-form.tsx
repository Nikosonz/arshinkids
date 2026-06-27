import Link from "next/link";
import { Field, Input, Textarea, Select, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";

export interface CourseFormValues {
  slug?: string;
  title?: string;
  summary?: string;
  description?: string | null;
  coverUrl?: string | null;
  accessType?: "FREE" | "PAID";
  price?: number | null;
  order?: number;
  published?: boolean;
}

export function CourseForm({
  action,
  values = {},
}: {
  action: (fd: FormData) => void | Promise<void>;
  values?: CourseFormValues;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="عنوان دوره" htmlFor="title" required>
          <Input id="title" name="title" defaultValue={values.title} required />
        </Field>
        <Field label="نامک (slug)" htmlFor="slug" hint="خالی بگذارید تا خودکار ساخته شود">
          <Input id="slug" name="slug" dir="ltr" className="text-right" defaultValue={values.slug} />
        </Field>
      </div>

      <Field label="خلاصه" htmlFor="summary" required>
        <Textarea id="summary" name="summary" rows={2} defaultValue={values.summary} required />
      </Field>

      <Field label="توضیحات کامل" htmlFor="description">
        <Textarea id="description" name="description" rows={6} defaultValue={values.description ?? ""} />
      </Field>

      <ImageUpload
        name="coverUrl"
        folder="courses"
        defaultUrl={values.coverUrl ?? ""}
        label="تصویر کاور"
        hint="اختیاری — یک تصویر آپلود کنید"
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="نوع دسترسی" htmlFor="accessType">
          <Select id="accessType" name="accessType" defaultValue={values.accessType ?? "FREE"}>
            <option value="FREE">رایگان</option>
            <option value="PAID">قابل خرید</option>
          </Select>
        </Field>
        <Field label="قیمت (تومان)" htmlFor="price" hint="فقط برای دوره‌های قابل خرید">
          <Input id="price" name="price" type="number" min={0} dir="ltr" className="text-right" defaultValue={values.price ?? ""} />
        </Field>
        <Field label="ترتیب نمایش" htmlFor="order">
          <Input id="order" name="order" type="number" dir="ltr" className="text-right" defaultValue={values.order ?? 0} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={values.published ?? false} className="h-4 w-4" />
        منتشر شود
      </label>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>ذخیره</SubmitButton>
        <Link href="/admin/courses" className="text-sm text-[var(--text-muted)]">
          انصراف
        </Link>
      </div>
    </form>
  );
}
