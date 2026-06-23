import { prisma } from "@/lib/db";
import { LeadCard, type LeadView } from "@/components/admin/lead-card";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getLeads() {
  try {
    return await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

  const views: LeadView[] = leads.map((l) => ({
    id: l.id,
    parentName: l.parentName,
    phone: l.phone,
    childName: l.childName,
    childBirthYear: l.childBirthYear,
    program: l.program,
    message: l.message,
    status: l.status,
    createdAtLabel: formatDate(l.createdAt),
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">درخواست‌های ثبت‌نام</h1>
      {views.length === 0 ? (
        <p className="text-[var(--text-muted)]">هنوز درخواستی ثبت نشده است.</p>
      ) : (
        <div className="space-y-4">
          {views.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
