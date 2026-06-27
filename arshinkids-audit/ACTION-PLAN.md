# Action Plan — arshinkids.com SEO Audit
*Audited: 2026-06-25*

---

## Phase 1 — Quick Wins (This Week, ~2 hours total)

| # | Task | File | Time |
|---|------|------|------|
| 1 | Create `public/llms.txt` | new file | 15 min |
| 2 | Delete 5 stale SVGs from `/public` | delete | 2 min |
| 3 | Add mobile + WhatsApp to schema `sameAs` + `telephone` | `lib/seo.tsx` | 5 min |
| 4 | Add real postal code | `lib/business.ts` | 2 min |
| 5 | Add "کرج" to homepage subtitle or H1 | `app/(site)/page.tsx` | 5 min |
| 6 | Remove Framer Motion if unused (or wrap with LazyMotion) | `package.json` | 15 min |

---

## Phase 2 — Content (Weeks 2–3, owner involvement required)

| # | Task | Who |
|---|------|-----|
| 7 | Write real About page content (history, team, capacity) | Owner |
| 8 | Publish 3-5 news posts via /admin/news/new | Owner |
| 9 | Upload 8-12 gallery photos via /admin/gallery | Owner |
| 10 | Add 3-5 staff profiles via /admin/staff/new | Owner |
| 11 | Write unique 120-160 char meta descriptions for each page | Dev |
| 12 | Add BreadcrumbList schema to program detail + news pages | Dev |

---

## Phase 3 — Authority & Local (Month 2)

| # | Task | Notes |
|---|------|-------|
| 13 | Claim/verify Google Business Profile | Requires VPN from Iran |
| 14 | Add BlogPosting schema to news post template | `app/(site)/news/[slug]/page.tsx` |
| 15 | Add Content-Security-Policy header | `next.config.ts` |
| 16 | Add factual citable data to About page | founding year, capacity, ratio |

---

## Phase 4 — Ongoing

- Run PageSpeed Insights after each major deploy (use non-Iranian IP)
- Publish at least 1 news post per month
- Check Vercel build logs after each push
- Once GBP is set up, submit sitemap in Google Search Console

---

## Score Summary

| Category | Score | Weight | Contribution |
|----------|-------|--------|--------------|
| Technical SEO | 78 | 22% | 17.2 |
| Content Quality | 58 | 23% | 13.3 |
| On-Page SEO | 73 | 20% | 14.6 |
| Schema | 72 | 10% | 7.2 |
| Performance | 72 | 10% | 7.2 |
| AI Search Readiness | 42 | 10% | 4.2 |
| Images | 68 | 5% | 3.4 |
| **Overall** | **67** | | **/100** |

After Phase 1+2 fixes, estimated score: **78-82/100**.
