import { AdminHeader, Card } from "@/components/admin/ui";
import { ProgramForm } from "@/components/admin/program-form";
import { createProgram } from "../actions";

export const dynamic = "force-dynamic";

export default function NewProgramPage() {
  return (
    <div>
      <AdminHeader title="برنامه‌ی جدید" />
      <Card>
        <ProgramForm action={createProgram} />
      </Card>
    </div>
  );
}
