# Performance — arshinkids.com

**Score: 72/100**
*(Lab estimates only — no CrUX field data available from Iran. Real scores may differ.)*

## What Works
- Self-hosted Vazirmatn via next/font — zero render-blocking font requests
- next/image: automatic WebP/AVIF conversion, lazy loading, correct `sizes` on images
- ISR revalidation — pages served from Vercel edge cache
- browserslist drops legacy polyfills (~14KB saving)
- `poweredByHeader: false` — minimal response overhead

## Findings

### HIGH — Framer Motion bundle not tree-shaken
`framer-motion` ^12.41.0 is in dependencies. Per CLAUDE.md §8 it ships ~104KB. If any component imports from `framer-motion` directly (not `LazyMotion`+`m`), the full bundle loads on every page.
**Fix:** Audit all imports. If Framer Motion is not actually used in any current component, remove it (`npm uninstall framer-motion`). If used, switch to `LazyMotion` + `m` + `domAnimation` for dynamic loading.

### MEDIUM — OpenStreetMap iframe on contact page
The iframe (`openstreetmap.org/export/embed.html`) is a third-party resource that adds network round-trips, loads its own JS/CSS, and may block the main thread. It also requires an active connection to openstreetmap.org.
**Fix:** Consider `loading="lazy"` (already set ✅) and wrapping in an IntersectionObserver to defer below the fold. Already has `loading="lazy"` — this partially mitigates it.

### LOW — Logo is JPEG not WebP
`public/logo.jpg` is served as JPEG. next/image will auto-convert when used via `<Image>`, but the source file is still JPEG.
**Fix:** Not urgent — next/image handles conversion. Keep JPEG source.

### INFO — No real CWV measurement possible from Iran
CrUX API and PageSpeed Insights are blocked from local access. Actual LCP/CLS/INP unknown.
**Action:** Check https://pagespeed.web.dev after each deploy from a non-Iranian IP, or use Vercel's Speed Insights if enabled.
