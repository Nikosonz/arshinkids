import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { StaffForm } from "@/components/admin/staff-form";
import { updateStaff } from "../actions";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditStaffPage({ params }: Params) {
  const { id } = await params;
  const member = await prisma.staffMember.findUnique({ where: { id } }).catch(() => null);
  if (!member) notFound();

  return (
    <div>
      <AdminHeader title={`ویرایش: ${member.name}`} />
      <Card>
        <StaffForm action={updateStaff.bind(null, member.id)} values={member} />
      </Card>
    </div>
  );
}
