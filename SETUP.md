# راه‌اندازی و انتشار — Arshin Kids

سایت با Next.js 16 + Prisma 7 (Neon Postgres) + Tailwind v4 ساخته شده. فارسی‌فقط (RTL). پنل مدیریت در `/admin`.

> محدودیت‌های ایران (CLAUDE.md §1): دیپلوی با `git push` (نه Vercel CLI)، تغییرات دیتابیس از طریق کنسول SQL نئون (نه `prisma migrate`)، فونت‌ها در بیلد Vercel دانلود می‌شوند.

## ۱) دیتابیس Neon
1. یک پروژه‌ی Postgres در [neon.tech](https://neon.tech) بساز.
2. در **SQL console** نئون، کل فایل `prisma/init.sql` را paste و اجرا کن (ساخت جدول‌ها).
3. اختیاری: `prisma/seed.sql` را اجرا کن (برنامه‌ها و سؤالات نمونه).
4. رشته‌ی اتصال pooled را برای `POSTGRES_PRISMA_URL` و رشته‌ی direct را برای `DATABASE_URL` بردار.

## ۲) ساخت کاربر مدیر
```bash
node scripts/create-admin.mjs admin@arshinkids.com "یک-رمز-قوی" "نام مدیر"
```
خروجی یک دستور `INSERT` است؛ آن را در کنسول SQL نئون اجرا کن.

## ۳) متغیرهای محیطی (Vercel → Project → Settings → Environment Variables)
طبق `.env.example`:
- `POSTGRES_PRISMA_URL` و `DATABASE_URL` — از نئون
- `SESSION_SECRET` — رشته‌ی تصادفی ۳۲+ کاراکتری (`openssl rand -base64 32`)
- `RESEND_API_KEY` و `LEAD_NOTIFY_EMAIL` — برای ایمیل درخواست‌های ثبت‌نام ([resend.com](https://resend.com))
- `BLOB_READ_WRITE_TOKEN` — برای آپلود تصاویر گالری (Vercel Blob)
- `UPSTASH_REDIS_REST_URL` و `UPSTASH_REDIS_REST_TOKEN` — برای محدودیت نرخ فرم (اختیاری)

## ۴) اتصال به Vercel و دیپلوی
1. ریپو را به یک مخزن گیت‌هاب push کن.
2. در Vercel آن مخزن را Import کن (فریم‌ورک: Next.js — خودکار تشخیص می‌دهد).
3. متغیرهای محیطی بالا را ست کن.
4. هر `git push` روی شاخه‌ی اصلی → بیلد و دیپلوی خودکار.
5. دامنه‌ی `arshinkids.com` (و `www`) را در Vercel وصل کن. `proxy.ts` ریدایرکت www→apex را انجام می‌دهد.

## ۵) کارهای محتوایی باقی‌مانده (TODO)
- `lib/business.ts`: نشانی، تلفن، ساعات کاری، مختصات نقشه و شبکه‌های اجتماعی واقعی را جایگزین کن (روی کل سایت و schema اثر دارد).
- متن «درباره ما» در `app/(site)/about/page.tsx`.
- از طریق پنل `/admin` برنامه‌ها، کادر، گالری و اخبار را تکمیل کن.

## دستورهای روزمره
- توسعه: `npm run dev`
- بررسی تایپ: `npm run typecheck` (قبل از هر دیپلوی باید بدون خطا باشد)
- بیلد: `npm run build`
- بعد از تغییر `schema.prisma`: SQL معادل را در نئون اجرا کن، سپس `npx prisma generate`.
