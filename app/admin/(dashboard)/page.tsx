import Link from "next/link";
import { Inbox, Puzzle, Users, Images, Newspaper } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [newLeads, programs, staff, gallery, posts, recentLeads] =
      await Promise.all([
        prisma.lead.count({ where: { status: "NEW" } }),
        prisma.program.count(),
        prisma.staffMember.count(),
        prisma.galleryImage.count(),
        prisma.post.count(),
        prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      ]);
    return { newLeads, programs, staff, gallery, posts, recentLeads };
  } catch {
    return {
      newLeads: 0,
      programs: 0,
      staff: 0,
      gallery: 0,
      posts: 0,
      recentLeads: [],
    };
  }
}

export default async function AdminDashboard() {
  const s = await getStats();

  const cards = [
    { label: "درخواست‌های جدید", value: s.newLeads, icon: Inbox, href: "/admin/leads" },
    { label: "برنامه‌ها", value: s.programs, icon: Puzzle, href: "/admin/programs" },
    { label: "کادر آموزشی", value: s.staff, icon: Users, href: "/admin/staff" },
    { label: "تصاویر گالری", value: s.gallery, icon: Images, href: "/admin/gallery" },
    { label: "اخبار", value: s.posts, icon: Newspaper, href: "/admin/news" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">داشبورد</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="flex items-center gap-4 transition-transform hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent-hover)]">
                <c.icon className="h-6 w-6" />
              </span>
              <div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-sm text-[var(--text-muted)]">{c.label}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="mb-4 font-bold">آخرین درخواست‌ها</h2>
        {s.recentLeads.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">درخواستی ثبت نشده است.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {s.recentLeads.map((lead) => (
              <li
                key={lead.id}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium">{lead.parentName}</span>
                  <span className="bidi-plaintext mr-2 text-[var(--text-muted)]">
                    {lead.phone}
                  </span>
                </div>
                <time className="text-xs text-[var(--text-muted)]">
                  {formatDate(lead.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/admin/leads"
          className="mt-4 inline-block text-sm font-semibold text-[var(--accent-hover)]"
        >
          مشاهده‌ی همه ←
        </Link>
      </Card>
    </div>
  );
}
