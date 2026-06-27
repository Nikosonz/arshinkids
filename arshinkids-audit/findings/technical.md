# Technical SEO — arshinkids.com

**Score: 78/100**

## What Works
- robots.txt correct: AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) explicitly allowed; /admin and /api blocked
- XML sitemap at /sitemap.xml — dynamic, includes programs + news posts, fixed BUILD_DATE (no lastmod churn)
- Security headers via next.config.ts: HSTS (2yr preload), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- `poweredByHeader: false` — server fingerprint hidden
- `<html lang="fa" dir="rtl">` — correct locale + direction declaration
- Vazirmatn font self-hosted via next/font — no render-blocking external Google Fonts call
- Modern browserslist: chrome/edge/firefox ≥111, safari ≥16.4 — drops ~14KB polyfills
- ISR `revalidate=300` on public pages — fast static delivery + fresh content
- `next/image` used throughout — automatic WebP/AVIF, lazy loading, correct sizing

## Findings

### MEDIUM — No Content-Security-Policy header
CSP is missing from next.config.ts securityHeaders array. Without it, injected scripts (XSS) can run freely.
**Fix:** Add `Content-Security-Policy` header with `default-src 'self'; script-src 'self' 'unsafe-inline'; frame-src openstreetmap.org; img-src 'self' blob: data: *.public.blob.vercel-storage.com`

### MEDIUM — llms.txt missing
`/public/llms.txt` does not exist. CLAUDE.md §8 requires it for AI search readiness. AI platforms (ChatGPT, Perplexity) use it to understand site structure.
**Fix:** Create `public/llms.txt` with H1 + site summary + Markdown links to key pages.

### LOW — Stale default SVGs in /public
`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` from create-next-app remain in /public. These are indexed dead weight.
**Fix:** Delete them.

### LOW — robots.txt multi-User-Agent format
Current robots.txt lists multiple User-Agent lines before a single Allow block. While technically valid, some crawlers may misparse. Standard format: separate rule blocks per bot.
**Fix:** Separate into distinct blocks or consolidate into `User-Agent: *` since all bots get the same rule.

### INFO — Framer Motion not using LazyMotion
`framer-motion` ^12.41.0 is installed (~104KB). CLAUDE.md §8 warns to use `LazyMotion` + `m` to keep it off first load. Check if it's currently used in any component.
