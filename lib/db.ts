import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

/**
 * Prisma client singleton (PrismaPg adapter → Neon Postgres). CLAUDE.md §2/§7.
 * Import the DB through THIS module only — never the generated client directly.
 */

const connectionString =
  process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
