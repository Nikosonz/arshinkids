"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

/** Generic delete button — pass a server action bound with the row id. */
export function DeleteButton({
  action,
  confirmText = "حذف شود؟",
  label,
}: {
  action: () => Promise<void>;
  confirmText?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmText)) startTransition(() => action());
      }}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {label ?? "حذف"}
    </button>
  );
}
