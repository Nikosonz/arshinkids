import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatPrice } from "@/lib/utils";
import { deleteCourse } from "./actions";

export const dynamic = "force-dynamic";

async function getCoursesAdmin() {
  try {
    return await prisma.course.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { lessons: true } } },
    });
  } catch {
    return [];
  }
}

export default async function AdminCoursesPage() {
  const courses = await getCoursesAdmin();

  return (
    <div>
      <AdminHeader
        title="دوره‌های ویدیویی"
        action={{ href: "/admin/courses/new", label: "+ دوره جدید" }}
      />
      {courses.length === 0 ? (
        <Card>
          <p className="text-[var(--text-muted)]">هنوز دوره‌ای ثبت نشده است.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <div className="flex items-center gap-2 font-bold">
                  {c.title}
                  {!c.published && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      پیش‌نویس
                    </span>
                  )}
                  <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-xs text-[var(--accent-hover)]">
                    {c.accessType === "PAID" ? "قابل خرید" : "رایگان"}
                  </span>
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {c._count.lessons} درس
                  {c.accessType === "PAID" && c.price ? ` — ${formatPrice(c.price)}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/courses/${c.id}`}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--accent-hover)] hover:bg-[var(--accent-subtle)]"
                >
                  <Pencil className="h-4 w-4" /> ویرایش
                </Link>
                <DeleteButton
                  action={deleteCourse.bind(null, c.id)}
                  confirmText={`دوره «${c.title}» و همه‌ی درس‌هایش حذف شود؟`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
