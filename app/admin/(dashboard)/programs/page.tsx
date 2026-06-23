import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProgram } from "./actions";

export const dynamic = "force-dynamic";

async function getProgramsAdmin() {
  try {
    return await prisma.program.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminProgramsPage() {
  const programs = await getProgramsAdmin();

  return (
    <div>
      <AdminHeader
        title="برنامه‌ها"
        action={{ href: "/admin/programs/new", label: "+ برنامه‌ی جدید" }}
      />
      {programs.length === 0 ? (
        <Card>
          <p className="text-[var(--text-muted)]">هنوز برنامه‌ای اضافه نشده است.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <div className="flex items-center gap-2 font-bold">
                  {p.title}
                  {!p.published && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      پیش‌نویس
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {p.ageRange ?? "—"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/programs/${p.id}`}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--accent-hover)] hover:bg-[var(--accent-subtle)]"
                >
                  <Pencil className="h-4 w-4" /> ویرایش
                </Link>
                <DeleteButton
                  action={deleteProgram.bind(null, p.id)}
                  confirmText={`برنامه‌ی «${p.title}» حذف شود؟`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
