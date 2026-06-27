-- Arshin Kids — initial schema DDL.
-- CLAUDE.md §1/§11: the DB is unreachable from local Iran, so we DON'T run
-- `prisma migrate`. Paste this whole file into the Neon SQL console and run it.
-- Keep it in sync with prisma/schema.prisma by hand.
--
-- NOTE: Prisma preserves camelCase column names, so they are double-quoted here
-- (unquoted identifiers fold to lowercase in Postgres and would not match).
-- `id` columns have no DB default — Prisma supplies cuid() on insert.

-- ---------- enums ----------
DO $$ BEGIN
  CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'READ', 'CONTACTED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- admin_users ----------
CREATE TABLE IF NOT EXISTS "admin_users" (
  "id"           text PRIMARY KEY,
  "email"        text NOT NULL UNIQUE,
  "passwordHash" text NOT NULL,
  "name"         text,
  "createdAt"    timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- leads ----------
CREATE TABLE IF NOT EXISTS "leads" (
  "id"             text PRIMARY KEY,
  "parentName"     text NOT NULL,
  "phone"          text NOT NULL,
  "childName"      text,
  "childBirthYear" integer,
  "program"        text,
  "message"        text,
  "service"        text NOT NULL DEFAULT 'enroll',
  "status"         "LeadStatus" NOT NULL DEFAULT 'NEW',
  "createdAt"      timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt"         timestamp(3)
);
CREATE INDEX IF NOT EXISTS "leads_status_createdAt_idx" ON "leads" ("status", "createdAt");

-- ---------- programs ----------
CREATE TABLE IF NOT EXISTS "programs" (
  "id"          text PRIMARY KEY,
  "slug"        text NOT NULL UNIQUE,
  "title"       text NOT NULL,
  "summary"     text NOT NULL,
  "description" text,
  "ageRange"    text,
  "color"       text NOT NULL DEFAULT 'accent',
  "icon"        text,
  "imageUrl"    text,
  "order"       integer NOT NULL DEFAULT 0,
  "published"   boolean NOT NULL DEFAULT true,
  "createdAt"   timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "programs_published_order_idx" ON "programs" ("published", "order");

-- ---------- staff ----------
CREATE TABLE IF NOT EXISTS "staff" (
  "id"        text PRIMARY KEY,
  "name"      text NOT NULL,
  "role"      text NOT NULL,
  "bio"       text,
  "photoUrl"  text,
  "order"     integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "staff_published_order_idx" ON "staff" ("published", "order");

-- ---------- gallery ----------
CREATE TABLE IF NOT EXISTS "gallery" (
  "id"        text PRIMARY KEY,
  "url"       text NOT NULL,
  "caption"   text,
  "order"     integer NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "gallery_order_idx" ON "gallery" ("order");

-- ---------- posts ----------
CREATE TABLE IF NOT EXISTS "posts" (
  "id"          text PRIMARY KEY,
  "slug"        text NOT NULL UNIQUE,
  "title"       text NOT NULL,
  "excerpt"     text,
  "content"     text NOT NULL,
  "coverUrl"    text,
  "published"   boolean NOT NULL DEFAULT false,
  "publishedAt" timestamp(3),
  "createdAt"   timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "posts_published_publishedAt_idx" ON "posts" ("published", "publishedAt");

-- ---------- faqs ----------
CREATE TABLE IF NOT EXISTS "faqs" (
  "id"        text PRIMARY KEY,
  "question"  text NOT NULL,
  "answer"    text NOT NULL,
  "order"     integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS "faqs_published_order_idx" ON "faqs" ("published", "order");

-- ---------- courses (video courses, Aparat-hosted) ----------
DO $$ BEGIN
  CREATE TYPE "AccessType" AS ENUM ('FREE', 'PAID');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "courses" (
  "id"          text PRIMARY KEY,
  "slug"        text NOT NULL UNIQUE,
  "title"       text NOT NULL,
  "summary"     text NOT NULL,
  "description" text,
  "coverUrl"    text,
  "accessType"  "AccessType" NOT NULL DEFAULT 'FREE',
  "price"       integer,
  "published"   boolean NOT NULL DEFAULT false,
  "order"       integer NOT NULL DEFAULT 0,
  "createdAt"   timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "courses_published_order_idx" ON "courses" ("published", "order");

CREATE TABLE IF NOT EXISTS "course_sections" (
  "id"       text PRIMARY KEY,
  "courseId" text NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "title"    text NOT NULL,
  "order"    integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "course_sections_courseId_order_idx" ON "course_sections" ("courseId", "order");

CREATE TABLE IF NOT EXISTS "lessons" (
  "id"            text PRIMARY KEY,
  "courseId"      text NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "sectionId"     text REFERENCES "course_sections"("id") ON DELETE SET NULL,
  "title"         text NOT NULL,
  "aparatHash"    text NOT NULL,
  "durationSec"   integer,
  "isFreePreview" boolean NOT NULL DEFAULT false,
  "order"         integer NOT NULL DEFAULT 0,
  "createdAt"     timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "lessons_courseId_order_idx" ON "lessons" ("courseId", "order");

-- ---------- customers / orders / enrollments (Phase B: accounts + Zarinpal) ----------
DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "customers" (
  "id"           text PRIMARY KEY,
  "email"        text NOT NULL UNIQUE,
  "passwordHash" text NOT NULL,
  "name"         text,
  "phone"        text UNIQUE,
  "createdAt"    timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id"         text PRIMARY KEY,
  "customerId" text NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "courseId"   text NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "amount"     integer NOT NULL,
  "status"     "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "authority"  text UNIQUE,
  "refId"      text,
  "createdAt"  timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt"     timestamp(3)
);
CREATE INDEX IF NOT EXISTS "orders_customerId_createdAt_idx" ON "orders" ("customerId", "createdAt");

CREATE TABLE IF NOT EXISTS "enrollments" (
  "id"         text PRIMARY KEY,
  "customerId" text NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "courseId"   text NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "orderId"    text UNIQUE REFERENCES "orders"("id") ON DELETE SET NULL,
  "createdAt"  timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("customerId", "courseId")
);
CREATE INDEX IF NOT EXISTS "enrollments_customerId_idx" ON "enrollments" ("customerId");
