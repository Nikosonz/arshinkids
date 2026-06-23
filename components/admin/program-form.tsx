import Link from "next/link";
import { Field, Input, Textarea, Select, SubmitButton } from "@/components/admin/ui";

export interface ProgramFormValues {
  slug?: string;
  title?: string;
  summary?: string;
  description?: string | null;
  ageRange?: string | null;
  color?: string;
  icon?: string | null;
  imageUrl?: string | null;
  order?: number;
  published?: boolean;
}

const colors = [
  { value: "accent", label: "نارنجی (اصلی)" },
  { value: "secondary", label: "آبی" },
  { value: "fun-green", label: "سبز" },
  { value: "fun-pink", label: "صورتی" },
  { value: "fun-yellow", label: "زرد" },
  { value: "fun-purple", label: "بنفش" },
];

const icons = [
  "baby",
  "blocks",
  "puzzle",
  "graduation-cap",
  "palette",
  "music",
  "book",
  "sparkles",
  "sun",
  "heart",
];

/** Shared create/edit form. `action` is a server action bound by the caller. */
export function ProgramForm({
  action,
  values = {},
}: {
  action: (fd: FormData) => void | Promise<void>;
  values?: ProgramFormValues;
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

      <Field label="توضیح کوتاه (کارت)" htmlFor="summary" required>
        <Textarea id="summary" name="summary" rows={2} defaultValue={values.summary} required />
      </Field>

      <Field label="توضیح کامل (صفحه)" htmlFor="description">
        <Textarea id="description" name="description" rows={6} defaultValue={values.description ?? ""} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="بازه‌ی سنی" htmlFor="ageRange">
          <Input id="ageRange" name="ageRange" placeholder="۳ تا ۴ سال" defaultValue={values.ageRange ?? ""} />
        </Field>
        <Field label="رنگ کارت" htmlFor="color">
          <Select id="color" name="color" defaultValue={values.color ?? "accent"}>
            {colors.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="آیکون" htmlFor="icon">
          <Select id="icon" name="icon" defaultValue={values.icon ?? "sparkles"}>
            {icons.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="نشانی تصویر" htmlFor="imageUrl" hint="اختیاری — از گالری آپلود کنید و لینک را اینجا بگذارید">
          <Input id="imageUrl" name="imageUrl" dir="ltr" className="text-right" defaultValue={values.imageUrl ?? ""} />
        </Field>
        <Field label="ترتیب نمایش" htmlFor="order">
          <Input id="order" name="order" type="number" defaultValue={values.order ?? 0} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={values.published ?? true} className="h-4 w-4" />
        منتشر شود
      </label>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>ذخیره</SubmitButton>
        <Link href="/admin/programs" className="text-sm text-[var(--text-muted)]">
          انصراف
        </Link>
      </div>
    </form>
  );
}
