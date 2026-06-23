import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 config. Connection URLs live here (no longer in schema.prisma).
 * The app connects via the PrismaPg adapter in lib/db.ts; this config is only
 * for CLI tooling. CLAUDE.md §1: we don't run `migrate`/`db push` from local
 * Iran — DDL is applied in the Neon SQL console (prisma/init.sql).
 *
 * Reading process.env directly (not Prisma's `env()` helper) with a local
 * fallback so offline `prisma generate` never throws. The real DATABASE_URL is
 * set in the Vercel build env.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
