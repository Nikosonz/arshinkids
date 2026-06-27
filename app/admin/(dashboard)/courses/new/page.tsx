import { AdminHeader, Card } from "@/components/admin/ui";
import { CourseForm } from "@/components/admin/course-form";
import { createCourse } from "../actions";

export const dynamic = "force-dynamic";

export default function NewCoursePage() {
  return (
    <div>
      <AdminHeader title="دوره جدید" />
      <Card>
        <CourseForm action={createCourse} />
      </Card>
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        پس از ذخیره، به صفحه‌ی ویرایش می‌روید تا فصل‌ها و درس‌ها را اضافه کنید.
      </p>
    </div>
  );
}
