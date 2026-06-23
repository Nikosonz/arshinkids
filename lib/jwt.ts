import { SignJWT, jwtVerify } from "jose";

/**
 * Pure JWT sign/verify (HS256). No next/headers, no "server-only" — safe to
 * import from proxy.ts AND server components. Cookie helpers live in
 * lib/session.ts. CLAUDE.md §5.
 */

export interface SessionPayload {
  userId: string;
  [key: string]: unknown;
}

function key(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function decrypt(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
