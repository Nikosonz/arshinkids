# Full SEO Audit — arshinkids.com
*Date: 2026-06-25 | Auditor: Claude Code seo-audit*

---

## Executive Summary

**SEO Health Score: 67/100**
**Business Type:** Local brick-and-mortar kindergarten & preschool — Karaj, Alborz, Iran

The technical foundation is solid — robots.txt, sitemap, security headers, self-hosted fonts, and structured data are all in place. The main weaknesses are content gaps (empty gallery, no news posts, placeholder about page) and missing AI search readiness (no llms.txt). Local SEO needs Google Business Profile verification.

### Top 5 Critical Issues
1. **llms.txt missing** — AI search platforms can't index the site structure
2. **About page placeholder text** — not real content; harms E-E-A-T
3. **No published news content** — zero fresh content signal for Google
4. **No Google Business Profile** — #1 local ranking signal absent
5. **postalCode empty** — invalid in JSON-LD schema and NAP

### Top 5 Quick Wins
1. Create `public/llms.txt` (15 min, big AI search impact)
2. Delete 5 stale create-next-app SVGs from `/public` (2 min)
3. Add mobile phone + WhatsApp to LocalBusiness schema (5 min)
4. Add real postal code to `business.ts` (2 min)
5. Fix Framer Motion: remove or LazyMotion-wrap (15 min, ~104KB bundle saving)

---

## Technical SEO — 78/100

**Strengths:**
- robots.txt correctly allows AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) and blocks /admin + /api
- Dynamic XML sitemap with fixed BUILD_DATE — no lastmod churn
- Full security header stack: HSTS (2yr preload), nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy
- `<html lang="fa" dir="rtl">` — correct locale + direction
- Vazirmatn self-hosted via next/font — no render-blocking Google Fonts request
- Modern browserslist drops ~14KB polyfills
- ISR revalidate=300 on public pages

**Issues:**
- No Content-Security-Policy (Medium)
- No llms.txt (High)
- 5 stale SVGs in /public (Low)
- Framer Motion not using LazyMotion (Medium)

---

## Content Quality — 58/100

**Strengths:**
- All copy in Farsi — correct for target audience
- Program descriptions clear with age ranges
- Enrollment form captures all relevant fields

**Issues:**
- About page: TODO placeholder text, not real kindergarten history (High)
- Meta descriptions thin: About is 34 chars; all pages generic (High)
- No news posts published — zero fresh content (High)
- Gallery empty — parents can't see the facility (Medium)
- No staff profiles — E-E-A-T signals missing (Medium)

---

## On-Page SEO — 73/100

**Strengths:**
- Unique title template (%s | مهدکودک آرشین) on all pages
- Single H1 on every page
- Good internal linking
- CTA buttons throughout

**Issues:**
- No breadcrumb navigation (Medium)
- H1 lacks geo keyword "کرج" (Low)

---

## Schema & Structured Data — 72/100

**Strengths:**
- LocalBusiness dual-type `["Preschool", "ChildCare"]`
- GeoCoordinates, OpeningHoursSpecification
- FAQPage schema
- sameAs with Instagram + Telegram

**Issues:**
- postalCode empty string in JSON-LD (High)
- No BreadcrumbList on inner pages (High)
- WhatsApp missing from sameAs (Medium)
- Mobile phone missing from schema telephone (Medium)
- No BlogPosting on news posts (Medium)

---

## Performance — 72/100

*(Lab estimates — CrUX blocked from Iran)*

**Strengths:**
- Self-hosted Vazirmatn — zero render-blocking font requests
- next/image with auto WebP/AVIF + lazy loading
- ISR edge caching
- Modern browserslist

**Issues:**
- Framer Motion ~104KB not tree-shaken (High)
- OpenStreetMap iframe on contact page (Medium — loading=lazy mitigates)

---

## AI Search Readiness — 42/100

**Strengths:**
- robots.txt allows all major AI crawlers
- LocalBusiness JSON-LD is machine-readable
- Consistent NAP

**Issues:**
- No llms.txt (Critical)
- About page lacks citable facts (High)
- Schema missing foundingDate, numberOfEmployees (Medium)

---

## Images — 68/100

**Strengths:**
- 1200×630 OG image via opengraph-image.tsx
- next/image throughout
- Logo with alt text

**Issues:**
- 5 stale unused SVGs in /public (Low)
- OG image Latin-only text (Low — documented limitation)

---

## Local SEO — 62/100

**Strengths:**
- NAP from single source (lib/business.ts) — consistent
- GeoCoordinates in schema
- OpenStreetMap + Neshan on contact page
- Two phones + WhatsApp

**Issues:**
- No Google Business Profile (High)
- postalCode missing (High)
- Mobile not in schema (Medium)
- No local geo keywords in body copy (Medium)

---

## Audit Artifacts

- [ACTION-PLAN.md](./ACTION-PLAN.md) — prioritized task list
- [findings/technical.md](./findings/technical.md)
- [findings/content.md](./findings/content.md)
- [findings/schema.md](./findings/schema.md)
- [findings/performance.md](./findings/performance.md)
- [findings/geo.md](./findings/geo.md)
- [findings/local.md](./findings/local.md)
- [audit-data.json](./audit-data.json) — structured data for report generation
