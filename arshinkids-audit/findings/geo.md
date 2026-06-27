# AI Search & GEO Readiness — arshinkids.com

**Score: 42/100**

## What Works
- robots.txt explicitly allows GPTBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended
- LocalBusiness JSON-LD provides machine-readable business data for AI extraction
- NAP data consistent across all page surfaces

## Findings

### CRITICAL — No llms.txt file
`/public/llms.txt` does not exist. This file is the primary signal for AI search platforms (ChatGPT Browse, Perplexity, Claude) to understand site structure and key pages. CLAUDE.md §8 explicitly requires it.
**Fix:** Create `public/llms.txt`:
```
# مهدکودک آرشین

مهدکودک و پیش‌دبستانی آرشین — محیطی امن، شاد و آموزشی برای کودکان در کرج، البرز.

## صفحات اصلی
- [خانه](https://www.arshinkids.com)
- [برنامه‌ها](https://www.arshinkids.com/programs)
- [درباره ما](https://www.arshinkids.com/about)
- [اخبار](https://www.arshinkids.com/news)
- [تماس و ثبت‌نام](https://www.arshinkids.com/contact)

## برنامه‌ها
- [شیرخوارگاه (۶ ماه تا ۱.۵ سال)](https://www.arshinkids.com/programs/shirkhar)
- [نوپا (۱.۵ تا ۳ سال)](https://www.arshinkids.com/programs/nopa)
- [مهدکودک (۳ تا ۴ سال)](https://www.arshinkids.com/programs/mahd)
- [پیش‌دبستانی (۵ تا ۶ سال)](https://www.arshinkids.com/programs/pish-dabestani)
- [فوق‌برنامه](https://www.arshinkids.com/programs/foogh-barnameh)
```

### HIGH — Farsi content not structured for AI citability
AI models extract and cite structured, paragraph-level facts. Current about page is a single generic paragraph. No factual claims (founded year, capacity, teacher:child ratio, certifications) that AI would cite.
**Fix:** Add factual, citable content to About page: "تأسیس در سال X"، "ظرفیت Y کودک"، "نسبت مربی به کودک Z".

### MEDIUM — No entity disambiguation beyond @id
Schema has `@id: SITE_URL#organization` but no `legalName`, `foundingDate`, or `numberOfEmployees` — signals that help AI models distinguish this entity.
**Fix:** Add these to localBusinessSchema() when owner provides the data.
