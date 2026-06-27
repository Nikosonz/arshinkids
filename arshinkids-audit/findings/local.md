# Local SEO — arshinkids.com

**Score: 62/100**
*(Local service: brick-and-mortar kindergarten, Karaj, Alborz, Iran)*

## What Works
- NAP sourced from single `lib/business.ts` — consistent across footer, contact page, JSON-LD
- GeoCoordinates: lat 35.826, lng 50.986 (Jahanshahar area, Karaj)
- OpenStreetMap embed on contact page — works in Iran, no API key needed
- Neshan (نشان) deep-link button for Iranian navigation app
- Opening hours in schema (Sat–Wed 08:00–16:00) match displayed hours
- Two phone numbers (landline + mobile) + WhatsApp — good for parents
- Instagram + Telegram social profiles linked

## Findings

### HIGH — No Google Business Profile signal
No GBP listing is referenced or verifiable. For local kindergartens, GBP is the #1 local ranking factor. Even with Iran access limitations, GBP affects how Google Maps shows the business.
**Action:** Verify/claim Google Business Profile for "مهدکودک آرشین" at maps.google.com (requires VPN from Iran). Add photos, hours, description.

### HIGH — postalCode missing from NAP
`postalCode: ""` in business.ts. Iran uses 10-digit postal codes. Missing ZIP/postal code weakens local schema and NAP citation consistency.
**Fix:** Add real postal code to `business.ts`.

### MEDIUM — Address format uses dashes not commas
Current: `"استان البرز-کرج-جهانشهر-میدان هلال احمر-خیابان فریما"`
Standard Persian address format uses commas or line breaks. Dashes reduce readability and may affect address parsers.
**Fix:** Consider: `"کرج، جهانشهر، میدان هلال احمر، خیابان فریما"` with `addressRegion: "البرز"` separately in schema (already done).

### MEDIUM — Schema only lists landline phone
`telephone: business.phone` in localBusinessSchema() uses only the landline. Mobile (`+989190333553`) is not in schema.
**Fix:** Use array: `"telephone": [business.phone, business.mobile]`

### MEDIUM — No review/rating schema
No customer reviews or aggregate rating in schema. Even zero reviews with a `AggregateRating` placeholder is fine if you have real reviews.
**Action:** Once GBP is set up and reviews collected, add `aggregateRating` to LocalBusiness schema.

### LOW — Neshan link format may not open app on all devices
`https://neshan.org/maps/places/@lat,lng,16z` is a web URL. For app deep-link on Android, use `neshan://` scheme.
**Fix:** Add both: `<a href="neshan://..." ...>` with web URL fallback. Or keep current — web URL redirects to app on most devices.

### LOW — No local area keywords in content
Content doesn't mention "کرج"، "جهانشهر"، "البرز" in page copy (only in address). Local keywords in body text boost local relevance.
**Fix:** Add to homepage hero or about page: "در جهانشهر کرج".
