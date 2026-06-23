import { AdminHeader, Card } from "@/components/admin/ui";
import { StaffForm } from "@/components/admin/staff-form";
import { createStaff } from "../actions";

export const dynamic = "force-dynamic";

export default function NewStaffPage() {
  return (
    <div>
      <AdminHeader title="عضو جدید کادر" />
      <Card>
        <StaffForm action={createStaff} />
      </Card>
    </div>
  );
}
