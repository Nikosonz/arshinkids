# Schema & Structured Data — arshinkids.com

**Score: 72/100**

## What Works
- LocalBusiness dual-type `["Preschool", "ChildCare"]` on homepage — correct for a kindergarten
- GeoCoordinates included (lat/lng from business.ts)
- OpeningHoursSpecification — Saturday–Wednesday 08:00–16:00
- FAQPage schema wired up (renders when FAQs exist in DB)
- sameAs includes Instagram + Telegram social profiles
- `@id` set to `${SITE_URL}#organization` for entity disambiguation

## Findings

### HIGH — postalCode is empty string in schema
`business.address.postalCode` is `""` — this outputs `"postalCode": ""` in JSON-LD, which is invalid. Google may flag this.
**Fix:** Either set real postal code in business.ts, or the schema already uses `|| undefined` to omit it — verify the actual rendered output. If empty string reaches the schema, add `|| undefined` fallback.

### HIGH — No BreadcrumbList schema on inner pages
Program detail pages, about, contact, news — none have BreadcrumbList. This is a missed rich result opportunity and helps Google understand site hierarchy.
**Fix:** Add BreadcrumbList JSON-LD to program detail pages: Home > Programs > [Program Name].

### MEDIUM — BlogPosting schema missing on news posts
News post pages (when published) have no structured data.
**Fix:** Add BlogPosting schema to `app/(site)/news/[slug]/page.tsx` with `headline`, `datePublished`, `dateModified`, `image`, `author`.

### MEDIUM — WhatsApp not in sameAs
`business.socials.whatsapp` is set but not included in `sameAs` array in `localBusinessSchema()`.
**Fix:** Add to sameAs filter: `[instagram, telegram, whatsapp].filter(Boolean)`.

### MEDIUM — Mobile phone not in schema
Schema only uses `business.phone` (landline). Mobile `+989190333553` is not listed.
**Fix:** Add `"telephone": [business.phone, business.mobile]` array, or add second `telephone` property.

### LOW — No Course/EducationalOccupationalProgram schema on program pages
Program detail pages describe age-specific educational programs — good candidate for `Course` or `ChildrensEducationalOrganization` markup.
**Fix:** Add minimal Course schema: name, description, provider, audience age range.
