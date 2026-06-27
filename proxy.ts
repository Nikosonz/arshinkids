import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/lib/jwt";

/**
 * Proxy (formerly middleware — Next 16 renamed it; NEVER add middleware.ts too).
 * Runs on Node.js runtime by default in v16. CLAUDE.md §3/§5.
 *
 *  - Server-side admin gate: /admin* (except /admin/login) requires a valid
 *    session cookie. This is the REAL protection (UI does not enforce auth).
 *
 * Host canonicalization (www vs apex) is handled by Vercel's Domains config, NOT
 * here — having both fight each other causes an infinite redirect loop.
 * Single locale (Farsi) — no root locale redirect; "/" is the home page.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // admin gate
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await decrypt(req.cookies.get("session")?.value);
    if (!session?.userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // customer account gate (login/register stay public)
  if (
    pathname.startsWith("/account") &&
    pathname !== "/account/login" &&
    pathname !== "/account/register"
  ) {
    const session = await decrypt(req.cookies.get("customer_session")?.value);
    if (session?.role !== "customer") {
      const url = req.nextUrl.clone();
      url.pathname = "/account/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except static assets, image optimizer, and known metadata files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og.png|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
