# Arshin Kids — وب‌سایت مهدکودک آرشین

وب‌سایت فارسی (RTL) مهدکودک و پیش‌دبستانی آرشین با تمرکز بر جذب ثبت‌نام، به‌همراه پنل مدیریت محتوا.

## استک
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** · Framer Motion · Lucide
- **Prisma 7** + PrismaPg + **Neon Postgres**
- احراز هویت JWT دست‌ساز (`jose`) · ایمیل با **Resend** · آپلود با **Vercel Blob**

## ساختار
- `app/(site)/` — صفحات عمومی (خانه، برنامه‌ها، درباره، گالری، اخبار، تماس/ثبت‌نام)
- `app/admin/` — پنل مدیریت (داشبورد، درخواست‌ها، CRUD برنامه‌ها/کادر/گالری/اخبار)
- `app/api/contact` — endpoint فرم ثبت‌نام
- `lib/` — `db`, `session`/`jwt`, `business` (NAP), `data`, `seo`, `validation`
- `proxy.ts` — ریدایرکت www→apex + گیت ادمین
- `prisma/` — `schema.prisma`, `init.sql`, `seed.sql`

## شروع
```bash
npm install
npm run dev
```

راه‌اندازی کامل (دیتابیس، متغیرهای محیطی، کاربر مدیر، دیپلوی Vercel): **[SETUP.md](./SETUP.md)**
قراردادها و نکات پروژه: **[CLAUDE.md](./CLAUDE.md)**
