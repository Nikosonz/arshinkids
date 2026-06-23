import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteStaff } from "./actions";

export const dynamic = "force-dynamic";

async function getStaffAdmin() {
  try {
    return await prisma.staffMember.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminStaffPage() {
  const staff = await getStaffAdmin();

  return (
    <div>
      <AdminHeader
        title="کادر آموزشی"
        action={{ href: "/admin/staff/new", label: "+ عضو جدید" }}
      />
      {staff.length === 0 ? (
        <Card>
          <p className="text-[var(--text-muted)]">هنوز عضوی اضافه نشده است.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {staff.map((m) => (
            <Card key={m.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <div className="flex items-center gap-2 font-bold">
                  {m.name}
                  {!m.published && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      مخفی
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--text-muted)]">{m.role}</div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/staff/${m.id}`}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--accent-hover)] hover:bg-[var(--accent-subtle)]"
                >
                  <Pencil className="h-4 w-4" /> ویرایش
                </Link>
                <DeleteButton
                  action={deleteStaff.bind(null, m.id)}
                  confirmText={`«${m.name}» حذف شود؟`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
