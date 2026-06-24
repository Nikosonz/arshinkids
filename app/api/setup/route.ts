import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/server/password";

/**
 * ONE-TIME setup route. Runs on Vercel (which CAN reach Neon, unlike the local
 * Iran machine — CLAUDE.md §1), so we don't need the Neon SQL console.
 *
 * Creates tables (idempotent), seeds sample programs/FAQs, and inserts the
 * admin user. Guarded by the SETUP_KEY env var. DELETE THIS ROUTE after running.
 *
 *   visit:  https://arshinkids.com/api/setup?key=<SETUP_KEY>
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" text PRIMARY KEY, "email" text NOT NULL UNIQUE, "passwordHash" text NOT NULL,
    "name" text, "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "leads" (
    "id" text PRIMARY KEY, "parentName" text NOT NULL, "phone" text NOT NULL,
    "childName" text, "childBirthYear" integer, "program" text, "message" text,
    "service" text NOT NULL DEFAULT 'enroll', "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "readAt" timestamp(3))`,
  `CREATE INDEX IF NOT EXISTS "leads_status_createdAt_idx" ON "leads" ("status","createdAt")`,
  `CREATE TABLE IF NOT EXISTS "programs" (
    "id" text PRIMARY KEY, "slug" text NOT NULL UNIQUE, "title" text NOT NULL,
    "summary" text NOT NULL, "description" text, "ageRange" text,
    "color" text NOT NULL DEFAULT 'accent', "icon" text, "imageUrl" text,
    "order" integer NOT NULL DEFAULT 0, "published" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE INDEX IF NOT EXISTS "programs_published_order_idx" ON "programs" ("published","order")`,
  `CREATE TABLE IF NOT EXISTS "staff" (
    "id" text PRIMARY KEY, "name" text NOT NULL, "role" text NOT NULL, "bio" text,
    "photoUrl" text, "order" integer NOT NULL DEFAULT 0, "published" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE INDEX IF NOT EXISTS "staff_published_order_idx" ON "staff" ("published","order")`,
  `CREATE TABLE IF NOT EXISTS "gallery" (
    "id" text PRIMARY KEY, "url" text NOT NULL, "caption" text,
    "order" integer NOT NULL DEFAULT 0, "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE INDEX IF NOT EXISTS "gallery_order_idx" ON "gallery" ("order")`,
  `CREATE TABLE IF NOT EXISTS "posts" (
    "id" text PRIMARY KEY, "slug" text NOT NULL UNIQUE, "title" text NOT NULL,
    "excerpt" text, "content" text NOT NULL, "coverUrl" text,
    "published" boolean NOT NULL DEFAULT false, "publishedAt" timestamp(3),
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE INDEX IF NOT EXISTS "posts_published_publishedAt_idx" ON "posts" ("published","publishedAt")`,
  `CREATE TABLE IF NOT EXISTS "faqs" (
    "id" text PRIMARY KEY, "question" text NOT NULL, "answer" text NOT NULL,
    "order" integer NOT NULL DEFAULT 0, "published" boolean NOT NULL DEFAULT true)`,
  `CREATE INDEX IF NOT EXISTS "faqs_published_order_idx" ON "faqs" ("published","order")`,
];

const SEED_PROGRAMS = `INSERT INTO "programs" ("id","slug","title","summary","ageRange","color","icon","order","published","createdAt","updatedAt") VALUES
  ('prog_shirkhar','shirkhar','شیرخوارگاه','مراقبت تخصصی و پر از مهر برای کوچک‌ترین مهمان‌های آرشین.','۶ ماه تا ۱٫۵ سال','fun-pink','baby',1,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_nopa','nopa','نوپا','بازی، حرکت و کشف دنیای اطراف برای شکل‌گیری مهارت‌های اولیه.','۱٫۵ تا ۳ سال','fun-green','blocks',2,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_mahd','mahd','مهدکودک','آموزش بازی‌محور، مهارت‌های اجتماعی و آماده‌سازی برای پیش‌دبستان.','۳ تا ۴ سال','secondary','puzzle',3,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_pish','pish-dabestani','پیش‌دبستانی','آمادگی کامل برای ورود به مدرسه؛ سواد پایه، ریاضی و خلاقیت.','۵ تا ۶ سال','accent','graduation-cap',4,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('prog_foogh','foogh-barnameh','فوق‌برنامه','زبان انگلیسی، نقاشی، موسیقی و ورزش در کنار برنامه‌ی اصلی.','همه‌ی سنین','fun-purple','palette',5,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
  ON CONFLICT ("slug") DO NOTHING`;

const SEED_FAQS = `INSERT INTO "faqs" ("id","question","answer","order","published") VALUES
  ('faq_age','از چه سنی کودکم را می‌توانم ثبت‌نام کنم؟','مهدکودک آرشین از سن ۶ ماهگی در بخش شیرخوارگاه پذیرش دارد و تا پیش‌دبستانی (۶ سال) ادامه می‌یابد.',1,true),
  ('faq_hours','ساعات کاری مهدکودک چگونه است؟','مهد در روزهای شنبه تا چهارشنبه از ساعت ۷:۳۰ صبح تا ۱۶ باز است. ساعات دقیق را در صفحه‌ی تماس ببینید.',2,true),
  ('faq_food','تغذیه‌ی کودکان چگونه تأمین می‌شود؟','وعده‌های غذایی سالم و میان‌وعده زیر نظر کارشناس تغذیه در مهد تهیه و سرو می‌شود.',3,true),
  ('faq_safety','از نظر ایمنی و بهداشت چه تمهیداتی دارید؟','فضای مهد به‌صورت روزانه ضدعفونی می‌شود، تجهیزات استاندارد و ایمن هستند و مربیان آموزش‌دیده به‌طور دائم همراه کودکان‌اند.',4,true),
  ('faq_enroll','مراحل ثبت‌نام چگونه است؟','فرم ثبت‌نام آنلاین را پر کنید؛ همکاران ما برای هماهنگی بازدید حضوری و تکمیل مدارک با شما تماس می‌گیرند.',5,true)
  ON CONFLICT ("id") DO NOTHING`;

/**
 * Admin user is created from env vars (NOT hardcoded — no credential in repo):
 *   SETUP_ADMIN_EMAIL, SETUP_ADMIN_PASSWORD, optional SETUP_ADMIN_NAME.
 * Password is hashed server-side. Skipped (with a note) if those env are unset.
 */
async function seedAdmin(log: string[]): Promise<void> {
  const email = process.env.SETUP_ADMIN_EMAIL;
  const password = process.env.SETUP_ADMIN_PASSWORD;
  if (!email || !password) {
    log.push("admin skipped (set SETUP_ADMIN_EMAIL + SETUP_ADMIN_PASSWORD)");
    return;
  }
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    log.push("admin already exists");
    return;
  }
  await prisma.adminUser.create({
    data: {
      id: randomUUID(),
      email,
      passwordHash: hashPassword(password),
      name: process.env.SETUP_ADMIN_NAME || "مدیر",
    },
  });
  log.push(`admin created: ${email}`);
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.SETUP_KEY || key !== process.env.SETUP_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  try {
    // enum type (separate try — no IF NOT EXISTS for CREATE TYPE)
    try {
      await prisma.$executeRawUnsafe(
        `CREATE TYPE "LeadStatus" AS ENUM ('NEW','READ','CONTACTED','ARCHIVED')`,
      );
      log.push("enum LeadStatus created");
    } catch {
      log.push("enum LeadStatus already exists");
    }

    for (const stmt of DDL) {
      await prisma.$executeRawUnsafe(stmt);
    }
    log.push(`ran ${DDL.length} DDL statements`);

    await prisma.$executeRawUnsafe(SEED_PROGRAMS);
    await prisma.$executeRawUnsafe(SEED_FAQS);
    log.push("seeded programs, faqs");
    await seedAdmin(log);

    const [programs, faqs, admins] = await Promise.all([
      prisma.program.count(),
      prisma.faq.count(),
      prisma.adminUser.count(),
    ]);

    return NextResponse.json({
      ok: true,
      log,
      counts: { programs, faqs, admins },
      next: "Delete /api/setup now (tell the assistant), then log in at /admin/login.",
    });
  } catch (err) {
    console.error("[setup] failed:", err);
    return NextResponse.json(
      { ok: false, log, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
