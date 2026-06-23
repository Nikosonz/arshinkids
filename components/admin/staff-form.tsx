import Link from "next/link";
import { Field, Input, Textarea, SubmitButton } from "@/components/admin/ui";

export interface StaffFormValues {
  name?: string;
  role?: string;
  bio?: string | null;
  photoUrl?: string | null;
  order?: number;
  published?: boolean;
}

export function StaffForm({
  action,
  values = {},
}: {
  action: (fd: FormData) => void | Promise<void>;
  values?: StaffFormValues;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="نام" htmlFor="name" required>
          <Input id="name" name="name" defaultValue={values.name} required />
        </Field>
        <Field label="سمت" htmlFor="role" required>
          <Input id="role" name="role" placeholder="مربی / مدیر" defaultValue={values.role} required />
        </Field>
      </div>

      <Field label="معرفی کوتاه" htmlFor="bio">
        <Textarea id="bio" name="bio" rows={3} defaultValue={values.bio ?? ""} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="نشانی عکس" htmlFor="photoUrl" hint="اختیاری — از گالری آپلود کنید">
          <Input id="photoUrl" name="photoUrl" dir="ltr" className="text-right" defaultValue={values.photoUrl ?? ""} />
        </Field>
        <Field label="ترتیب نمایش" htmlFor="order">
          <Input id="order" name="order" type="number" defaultValue={values.order ?? 0} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={values.published ?? true} className="h-4 w-4" />
        نمایش در سایت
      </label>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>ذخیره</SubmitButton>
        <Link href="/admin/staff" className="text-sm text-[var(--text-muted)]">
          انصراف
        </Link>
      </div>
    </form>
  );
}
