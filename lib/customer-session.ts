import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "./jwt";

/**
 * Customer (end-user) session — SEPARATE cookie from the admin `session`, so an
 * admin login is never a customer login and vice versa. Reuses the same HS256
 * sign/verify (lib/jwt.ts). CLAUDE.md §5.
 */

const COOKIE = "customer_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function createCustomerSession(customerId: string): Promise<void> {
  const token = await encrypt({ userId: customerId, role: "customer" });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function deleteCustomerSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Current customer id, or null if not logged in / invalid. */
export async function getCustomerId(): Promise<string | null> {
  const store = await cookies();
  const payload = await decrypt(store.get(COOKIE)?.value);
  if (!payload || payload.role !== "customer") return null;
  return payload.userId;
}
