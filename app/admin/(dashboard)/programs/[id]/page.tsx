import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { ProgramForm } from "@/components/admin/program-form";
import { updateProgram } from "../actions";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditProgramPage({ params }: Params) {
  const { id } = await params;
  const program = await prisma.program.findUnique({ where: { id } }).catch(() => null);
  if (!program) notFound();

  return (
    <div>
      <AdminHeader title={`ویرایش: ${program.title}`} />
      <Card>
        <ProgramForm action={updateProgram.bind(null, program.id)} values={program} />
      </Card>
    </div>
  );
}
