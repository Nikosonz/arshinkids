import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/server/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { business } from "@/lib/business";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin(); // defense in depth — proxy.ts is the primary gate

  return (
    <div className="min-h-screen bg-[var(--surface-2)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:flex-row md:p-6">
        {/* sidebar */}
        <aside className="w-full shrink-0 rounded-3xl border border-border bg-[var(--surface)] p-4 md:w-64">
          <div className="mb-6 px-2 pt-2">
            <div className="text-lg font-bold">{business.name}</div>
            <div className="text-xs text-[var(--text-muted)]">پنل مدیریت</div>
          </div>
          <AdminNav />
          <div className="mt-6 space-y-1 border-t border-border pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--accent-subtle)]"
            >
              <ExternalLink className="h-5 w-5" />
              مشاهده‌ی سایت
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                خروج
              </button>
            </form>
          </div>
        </aside>

        {/* content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
