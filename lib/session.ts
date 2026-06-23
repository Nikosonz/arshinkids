import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt, type SessionPayload } from "./jwt";

/**
 * Cookie-based session helpers (server components / actions / route handlers).
 * Pure sign/verify lives in lib/jwt.ts so proxy.ts can use it too. CLAUDE.md §5.
 */

const COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export { encrypt, decrypt };
export type { SessionPayload };

export async function createSession(userId: string): Promise<void> {
  const token = await encrypt({ userId });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Read + verify the current session. Returns null if missing/invalid. */
export async function verifySession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decrypt(store.get(COOKIE)?.value);
}
