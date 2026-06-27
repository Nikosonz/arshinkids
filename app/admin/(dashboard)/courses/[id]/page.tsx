import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  AdminHeader,
  Card,
  Field,
  Input,
  Select,
  SubmitButton,
} from "@/components/admin/ui";
import { CourseForm } from "@/components/admin/course-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { aparatWatchUrl } from "@/lib/aparat";
import {
  updateCourse,
  addSection,
  deleteSection,
  addLesson,
  deleteLesson,
} from "../actions";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditCoursePage({ params }: Params) {
  const { id } = await params;
  const course = await prisma.course
    .findUnique({
      where: { id },
      include: {
        sections: { orderBy: { order: "asc" } },
        lessons: { orderBy: { order: "asc" } },
      },
    })
    .catch(() => null);
  if (!course) notFound();

  const sectionTitle = (sid: string | null) =>
    course.sections.find((s) => s.id === sid)?.title ?? "بدون فصل";

  return (
    <div className="space-y-6">
      <AdminHeader title={`ویرایش دوره: ${course.title}`} />

      <Card>
        <CourseForm
          action={updateCourse.bind(null, course.id)}
          values={course}
        />
      </Card>

      {/* sections */}
      <Card>
        <h2 className="mb-4 text-lg font-bold">فصل‌ها</h2>
        {course.sections.length > 0 && (
          <ul className="mb-4 space-y-2">
            {course.sections.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5"
              >
                <span className="font-medium">{s.title}</span>
                <DeleteButton
                  action={deleteSection.bind(null, course.id, s.id)}
                  confirmText={`فصل «${s.title}» حذف شود؟ (درس‌هایش بدون فصل می‌شوند)`}
                />
              </li>
            ))}
          </ul>
        )}
        <form
          action={addSection.bind(null, course.id)}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="flex-1">
            <Field label="عنوان فصل جدید" htmlFor="sec-title">
              <Input id="sec-title" name="title" placeholder="مثلاً: فصل اول" />
            </Field>
          </div>
          <div className="w-24">
            <Field label="ترتیب" htmlFor="sec-order">
              <Input id="sec-order" name="order" type="number" dir="ltr" className="text-right" defaultValue={0} />
            </Field>
          </div>
          <SubmitButton>افزودن فصل</SubmitButton>
        </form>
      </Card>

      {/* lessons */}
      <Card>
        <h2 className="mb-4 text-lg font-bold">درس‌ها</h2>
        {course.lessons.length > 0 && (
          <ul className="mb-5 space-y-2">
            {course.lessons.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-medium">
                    {l.title}
                    {l.isFreePreview && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        پیش‌نمایش رایگان
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span>{sectionTitle(l.sectionId)}</span>
                    <span>·</span>
                    <a
                      href={aparatWatchUrl(l.aparatHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="inline-flex items-center gap-1 underline"
                    >
                      {l.aparatHash} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <DeleteButton
                  action={deleteLesson.bind(null, course.id, l.id)}
                  confirmText={`درس «${l.title}» حذف شود؟`}
                />
              </li>
            ))}
          </ul>
        )}

        <form action={addLesson.bind(null, course.id)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="عنوان درس" htmlFor="les-title" required>
              <Input id="les-title" name="title" required />
            </Field>
            <Field label="فصل" htmlFor="les-section">
              <Select id="les-section" name="sectionId" defaultValue="">
                <option value="">بدون فصل</option>
                {course.sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field
            label="لینک آپارات"
            htmlFor="les-aparat"
            required
            hint="ویدیو را در آپارات آپلود کنید و لینک آن را اینجا بچسبانید (مثلاً https://www.aparat.com/v/XXXX)"
          >
            <Input id="les-aparat" name="aparat" dir="ltr" className="text-right" placeholder="https://www.aparat.com/v/…" required />
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="isFreePreview" className="h-4 w-4" />
              پیش‌نمایش رایگان (برای دوره‌های قابل خرید)
            </label>
            <div className="flex items-end gap-3">
              <div className="w-24">
                <Field label="ترتیب" htmlFor="les-order">
                  <Input id="les-order" name="order" type="number" dir="ltr" className="text-right" defaultValue={course.lessons.length} />
                </Field>
              </div>
              <SubmitButton>افزودن درس</SubmitButton>
            </div>
          </div>
        </form>
      </Card>

      <div>
        <Link href="/admin/courses" className="text-sm text-[var(--text-muted)]">
          ← بازگشت به فهرست دوره‌ها
        </Link>
      </div>
    </div>
  );
}
