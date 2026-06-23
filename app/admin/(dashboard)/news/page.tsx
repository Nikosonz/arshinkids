import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDate } from "@/lib/utils";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

async function getPostsAdmin() {
  try {
    return await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminNewsPage() {
  const posts = await getPostsAdmin();

  return (
    <div>
      <AdminHeader
        title="اخبار و اطلاعیه‌ها"
        action={{ href: "/admin/news/new", label: "+ خبر جدید" }}
      />
      {posts.length === 0 ? (
        <Card>
          <p className="text-[var(--text-muted)]">هنوز خبری ثبت نشده است.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
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
                  {p.publishedAt ? formatDate(p.publishedAt) : "منتشر نشده"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/news/${p.id}`}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--accent-hover)] hover:bg-[var(--accent-subtle)]"
                >
                  <Pencil className="h-4 w-4" /> ویرایش
                </Link>
                <DeleteButton
                  action={deletePost.bind(null, p.id)}
                  confirmText={`خبر «${p.title}» حذف شود؟`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
