@AGENTS.md

# CLAUDE.md — Arshin Kids (kindergarten website)

> Knowledge transfer from building pouyakarimi.ir, adapted for **Arshin (آرشین)** — a kindergarten/preschool site. Project = **Farsi-only**, **full CMS**, **enrollment-lead** focused, domain **arshinkids.com**. Conventions, gotchas, and lessons below. Written: 2026-06-23.
>
> **Deviation from the portfolio template:** this site is **single-locale (Farsi/RTL only)** — NO next-intl, NO `[locale]` routing, NO hreflang. Keep RTL + Vazirmatn. SEO uses `LocalBusiness`/`Preschool` schema (local business), not `Person`.

---

## 0. Who you're working for

- **Owner:** Pouya Karimi — full-stack developer + UI designer + AI consultant, based in **Iran**. Building this site for the Arshin kindergarten.
- **Audience:** Persian (Farsi) parents looking to enroll their child. Local Iran market.
- **Communication:** Owner often runs **caveman mode** (`/caveman`) — terse replies, drop filler, keep all technical substance, code blocks normal. Persists until "stop caveman" / "normal mode". Respect it.
- **SEO source of truth:** Google Search Central (`developers.google.com/search/blog` + `/search/docs`). Ground ALL SEO decisions there, not memory.

---

## 1. Hard environment constraints (these shaped every decision)

The dev machine is in **Iran**, so a lot of "normal" tooling is blocked. Plan around them from day one — this is the single most important section.

| Constraint | Consequence | Do instead |
|---|---|---|
| **Vercel CLI blocked in Iran** | `vercel --prod` / `vercel deploy` fail | Deploy = `git push origin master`. Connect repo to Vercel via GitHub → auto-deploys on push. **Push after every commit.** |
| **Neon Postgres unreachable from local Prisma** | `prisma migrate dev` / `db push` can't reach DB locally | Apply schema changes by hand via the **Neon SQL console** (web UI). Write `ALTER TABLE` / `CREATE TABLE` yourself, paste, run. Keep `schema.prisma` in sync manually, then `npx prisma generate` locally (generate works offline). |
| **Google services geo-blocked** | PageSpeed API, CrUX, Search Console API, GA4 API, Google Fonts fetch — fail/403 from Iran | Run `npx tsc --noEmit` locally; let **Vercel's US build** do anything needing Google (e.g. `next/font/google` fetches fonts at build time on Vercel). SEO field data: paste manually or run from outside Iran. Google Maps links can't be fetched locally — ask owner to paste NAP details as text. |
| **Playwright browsers not installed** | Visual/screenshot tools fall back | WebFetch fallback; don't rely on rendered screenshots. |
| **Adding npm deps** | Owner is cost/bundle-conscious, has rejected deps (e.g. `recharts`) | **Ask before adding a dependency.** If rejected, build without it. Prefer what ships with the framework. |

**Rule of thumb:** anything that phones home to Google/Vercel/Neon at runtime-from-local fails. Push the work to the Vercel build, or do it through a web console.

---

## 2. Recommended stack (proven)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | 16.2.9 installed. Breaking changes vs older docs — see §3 |
| Language | TypeScript (strict) | `npx tsc --noEmit` must be 0 errors before every deploy |
| UI | React 19, **Tailwind CSS v4**, Framer Motion (optional), Lucide React | Tailwind v4 = no `tailwind.config.js`; tokens in `@theme inline {}` in globals.css |
| DB | **Neon Postgres** via **Prisma 7 + PrismaPg adapter** | Conn via `POSTGRES_PRISMA_URL` (preferred) or `DATABASE_URL` |
| Auth | JWT sessions (`jose`, HS256, 7-day, httpOnly cookie) | Hand-rolled, no NextAuth — see §5 |
| i18n | **NONE** — Farsi-only | Single locale. `<html lang="fa" dir="rtl">`. No next-intl. |
| Email | **Resend** (free tier, `onboarding@resend.dev` sender) | No domain verification on free tier |
| Storage | **Vercel Blob** (`@vercel/blob`) | Gallery / staff photo uploads |
| Rate limit | `@upstash/ratelimit` + `@upstash/redis` | Public enrollment/contact endpoint |
| Errors | `@sentry/nextjs` | optional |
| Deploy | Vercel via GitHub push | See §1 |

**Fonts:** self-host **Vazirmatn** via **`next/font/google`** (an `app/fonts.ts` exporting CSS-var classes), NOT a CSS `@import` of `fonts.googleapis.com`. A Google-Fonts `@import` is render-blocking AND fetches from a Google domain (blocked locally). next/font self-hosts the files; the fetch happens on Vercel's build.

---

## 3. Next.js 16 — breaking changes that bit us

- **`middleware.ts` is renamed `proxy.ts`** (repo root). **NEVER have both** — Next 16 hard-errors and every build breaks. Use `proxy.ts`.
- **Route params and `cookies()` are Promises** — always `await`:
  ```tsx
  const { slug } = await params;   // params: Promise<{slug: string}>
  const store = await cookies();
  ```
- **`AGENTS.md`** at root (loaded via `@AGENTS.md` import at top of this file): *"This is NOT the Next.js you know — read `node_modules/next/dist/docs/` before writing code."* When unsure about a v16 API, read the bundled docs there, don't trust training data.
- Build script: `"build": "prisma generate && next build"` so Vercel regenerates the Prisma client.
- `poweredByHeader: false` + security headers in `next.config`.

---

## 4. Farsi-only / RTL (no i18n library)

- `<html lang="fa" dir="rtl">` in root `app/layout.tsx`.
- Vazirmatn is the default body font (RTL). Latin/numeric runs: isolate with `unicode-bidi: plaintext` where mixed.
- All copy is Farsi, written inline in components (no message catalogs). Keep a `lib/content.ts` for repeated strings (nav labels, CTAs) if it helps reuse.
- Canonicals: per-page self-canonical to apex `https://arshinkids.com`. No hreflang (single locale).
- Persian digits: format dates/numbers with a shared `formatDate()` / `toFa()` util — don't inline `toLocaleDateString`.

---

## 5. Auth (hand-rolled JWT) — admin CMS

- Cookie `session`, httpOnly, 7-day JWT (HS256), signed with `SESSION_SECRET` env var.
- `lib/session.ts` exports: `encrypt`, `decrypt`, `createSession`, `deleteSession`, `verifySession`. (No `getSession` — don't invent one.)
- **Server-side gate in `proxy.ts`:** for any `/admin*` except `/admin/login`, `decrypt()` the cookie, redirect to login unless valid `userId`. This is the real protection.
- API routes under `/api/admin/*` independently call `verifySession()` (defense in depth).
- The admin shell UI (`"use client"`) does **NOT** enforce auth — UI only. `proxy.ts` covers it.
- Login: `POST /admin/login` → server action → `createSession` → redirect. Logout: server action → `deleteSession` → redirect.

---

## 6. Design system

- **Never hardcode hex in className.** Use CSS custom props: `var(--background)`, `var(--surface)`, `var(--border)`, `var(--text-primary)`, `var(--text-muted)`, `var(--accent)`, `var(--accent-hover)`, `var(--accent-subtle)`. Makes theming trivial.
- Kindergarten = warm, playful, trustworthy palette (soft primaries, rounded shapes, friendly). Keep contrast AA-accessible.
- Tailwind v4: `@import "tailwindcss"` in globals.css (no `@tailwind` directives, no config file). Custom tokens in `@theme inline {}`.
- Use **`cn()`** (clsx + tailwind-merge) for all conditional className merging.
- Fonts as CSS vars in `@theme` → utilities `font-heading` / `font-body` / `font-farsi`.
- Shared `formatDate()` util — don't inline `toLocaleDateString`.

---

## 7. Server/client + data patterns

- **Server actions:** `"use server"` at top. Call `revalidatePath()` after mutations.
- **Thin client components:** `"use client"` only for hooks/event handlers. They call server actions, not business logic.
- **Independent async ops:** `Promise.allSettled` so one failure doesn't block the other:
  ```ts
  const [dbResult, emailResult] = await Promise.allSettled([dbOp, emailOp]);
  if (dbResult.status === "rejected") throw dbResult.reason;  // DB required
  // email failure non-fatal → log, still 200
  ```
- **Module-level singletons** for expensive clients (Prisma, Resend) — never per-request.
- **Always escape user input** before interpolating into HTML strings (email templates; escape `<` in JSON-LD).
- **Node-only libs** (e.g. `sanitize-html`) go in `lib/server/*`, not shared utils, so they don't leak into client bundles.
- Admin data pages: `export const dynamic = "force-dynamic"`.

---

## 8. SEO baseline (ship day 1) — LOCAL business

This is a local kindergarten, so local SEO + NAP consistency matter most.

- Per-page self-canonical (apex `https://arshinkids.com`). No hreflang (single locale).
- `robots.txt`: allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended), disallow `/admin` + `/api`, reference sitemap.
- Valid XML sitemap. **Gotcha:** don't set `lastModified: new Date()` on a `force-dynamic` sitemap — `<lastmod>` churns to "now" every crawl. Use a real content date or fixed build date.
- Security headers: HSTS preload, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- **JSON-LD:** `LocalBusiness` (subtype `Preschool` / `ChildCare`) on home with NAP, `geo`, `openingHours`, `areaServed`; `BreadcrumbList` from breadcrumb component; `FAQPage` on FAQ; `BlogPosting` on news posts if there's a blog.
- **NAP consistency:** exact same name/address/phone everywhere (footer, contact page, schema). Source it from one `lib/business.ts` constant.
- `llms.txt` for AI search: H1 + summary + **Markdown links** to key pages.
- Default branded **1200×630 OG image** in `app/layout.tsx`.
- Performance: self-host fonts (§2), cap LCP image with `sizes`, modern `browserslist` to drop ~14 KiB polyfills:
  ```json
  "browserslist": ["chrome >= 111", "edge >= 111", "firefox >= 111", "safari >= 16.4", "not dead"]
  ```
- Framer Motion ships ~104 KiB — if used, use `LazyMotion` + `m` (or CSS keyframes) to keep it off first load.

SEO skills are global: `seo`, `seo-audit`, `seo-technical`, `seo-schema`, `seo-content`, `seo-geo`, `seo-sitemap`, `seo-page`, `seo-local`. Run `/seo-local` after deploy.

---

## 9. Enrollment / lead form pattern

1. Client form: React Hook Form + Zod → `POST /api/contact` (or `/api/enroll`).
2. API route: Zod validate → honeypot check → rate limit → `Promise.allSettled([prisma.create, resend.send])`.
3. DB write required (failure → 500). Email failure non-fatal (log, still 200).
4. Sender: `Name <onboarding@resend.dev>` (Resend free tier). Recipient: owner's/kindergarten's email.
5. Admin inbox page to view + mark read.
6. Capture enrollment-relevant fields: parent name, phone, child name, child age/birth year, preferred program, message.

---

## 10. Content modeling tip

When two content types are structurally similar (news posts vs static "program" pages), **reuse one Prisma model** with a nullable discriminator instead of a second model. Saves a migration and the whole CRUD/editor stack.

---

## 11. Workflow conventions

- **Deploy:** commit → `git push origin master` → Vercel auto-builds. Verify `npx tsc --noEmit` first.
- **DB change:** edit `schema.prisma` → write equivalent SQL → run in Neon SQL console → `npx prisma generate` locally. Seeds = a single `INSERT ... VALUES (), (), ();` statement (multiple separate statements have half-run in the Neon console).
- **Never import the generated Prisma client directly** (`lib/generated/prisma/`) — go through `@/lib/db` or `@/lib/server/db`.
- **Commits:** Conventional Commits (`feat:` / `fix:` / `perf:` / `docs:` …).

---

## 12. New-project day-1 checklist

- [x] `npx create-next-app` (Next 16, App Router, TS, Tailwind v4)
- [x] `AGENTS.md` (read v16 docs) + this `CLAUDE.md`
- [x] `proxy.ts` (NOT middleware.ts) — www→apex + admin gate
- [x] `app/fonts.ts` self-hosting Vazirmatn; CSS vars in globals.css `@theme`; `<html lang="fa" dir="rtl">`
- [x] `lib/business.ts` single source for NAP (name/address/phone/hours/geo) — **TODO: fill real values**
- [x] Prisma 7 + PrismaPg + Neon; tables via Neon console (`prisma/init.sql` + `prisma/seed.sql`)
- [x] `lib/session.ts` + `lib/jwt.ts` JWT auth for admin CMS; `lib/server/password.ts` (scrypt)
- [x] CSS custom-property design tokens; `cn()` util
- [x] SEO baseline (§8): canonical, robots, sitemap, LocalBusiness JSON-LD, llms.txt, OG image, security headers, browserslist
- [ ] Connect repo to Vercel via GitHub; set env vars (see `.env.example`) in Vercel dashboard
- [ ] Run `prisma/init.sql` + `prisma/seed.sql` in Neon console; create admin via `node scripts/create-admin.mjs`
- [ ] First deploy via `git push`; verify build on Vercel (fonts fetch there, not locally)

**Remaining manual steps are in `SETUP.md`.** Build verified locally (`npx next build` → exit 0); local Prisma `ECONNREFUSED` during build is expected (no DB locally) — `lib/data.ts` `safe()` returns empty so pages still render.

---

*Transfer of working knowledge, not a substitute for the repo's own code. When this conflicts with repo reality, the repo wins — update this file.*
