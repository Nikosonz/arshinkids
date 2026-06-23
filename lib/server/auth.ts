import "server-only";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";

/**
 * Defense-in-depth admin guard for pages / server actions / route handlers.
 * proxy.ts is the primary gate (CLAUDE.md §5); this catches anything proxy's
 * matcher might miss (e.g. server functions on excluded paths).
 */
export async function requireAdmin(): Promise<string> {
  const session = await verifySession();
  if (!session?.userId) redirect("/admin/login");
  return session.userId;
}
