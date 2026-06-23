"use client";

import { useTransition } from "react";
import { Phone, Trash2, Baby, CalendarDays, Puzzle } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/app/admin/(dashboard)/leads/actions";
import { cn } from "@/lib/utils";

export interface LeadView {
  id: string;
  parentName: string;
  phone: string;
  childName: string | null;
  childBirthYear: number | null;
  program: string | null;
  message: string | null;
  status: string;
  createdAtLabel: string;
}

const STATUS: { value: string; label: string }[] = [
  { value: "NEW", label: "جدید" },
  { value: "READ", label: "خوانده‌شده" },
  { value: "CONTACTED", label: "تماس گرفته‌شد" },
  { value: "ARCHIVED", label: "بایگانی" },
];

const statusColor: Record<string, string> = {
  NEW: "bg-[var(--accent-subtle)] text-[var(--accent-hover)]",
  READ: "bg-[var(--secondary-subtle)] text-[var(--secondary)]",
  CONTACTED: "bg-green-50 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export function LeadCard({ lead }: { lead: LeadView }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-[var(--surface)] p-5",
        pending && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{lead.parentName}</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                statusColor[lead.status],
              )}
            >
              {STATUS.find((s) => s.value === lead.status)?.label ?? lead.status}
            </span>
          </div>
          <a
            href={`tel:${lead.phone}`}
            className="bidi-plaintext mt-1 flex items-center gap-1.5 text-sm text-[var(--text-muted)]"
          >
            <Phone className="h-4 w-4" />
            {lead.phone}
          </a>
        </div>
        <time className="text-xs text-[var(--text-muted)]">
          {lead.createdAtLabel}
        </time>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--text-muted)]">
        {lead.childName && (
          <span className="flex items-center gap-1.5">
            <Baby className="h-4 w-4" /> {lead.childName}
          </span>
        )}
        {lead.childBirthYear && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> متولد {lead.childBirthYear}
          </span>
        )}
        {lead.program && (
          <span className="flex items-center gap-1.5">
            <Puzzle className="h-4 w-4" /> {lead.program}
          </span>
        )}
      </div>

      {lead.message && (
        <p className="mt-3 rounded-2xl bg-[var(--surface-2)] p-3 text-sm leading-7">
          {lead.message}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={lead.status}
          disabled={pending}
          onChange={(e) =>
            startTransition(() => updateLeadStatus(lead.id, e.target.value))
          }
          className="rounded-full border border-border bg-[var(--surface)] px-3 py-1.5 text-sm outline-none"
        >
          {STATUS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("این درخواست حذف شود؟"))
              startTransition(() => deleteLead(lead.id));
          }}
          className="mr-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" /> حذف
        </button>
      </div>
    </div>
  );
}
