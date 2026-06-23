"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/auth";
import type { LeadStatus } from "@/lib/generated/prisma/enums";

const VALID: LeadStatus[] = ["NEW", "READ", "CONTACTED", "ARCHIVED"];

export async function updateLeadStatus(id: string, status: string) {
  await requireAdmin();
  if (!VALID.includes(status as LeadStatus)) return;
  await prisma.lead.update({
    where: { id },
    data: {
      status: status as LeadStatus,
      readAt: status === "NEW" ? null : new Date(),
    },
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
