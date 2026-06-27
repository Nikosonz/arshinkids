# Content Quality — arshinkids.com

**Score: 58/100**

## What Works
- All copy in Farsi — correct for target audience
- Good heading hierarchy on homepage
- Program descriptions are clear and age-appropriate
- Enrollment form captures all relevant parent/child fields
- Contact page has address, two phone numbers, WhatsApp, email, map

## Findings

### HIGH — About page has placeholder TODO text
`app/(site)/about/page.tsx` line 53 contains `{/* TODO(owner): متن واقعی معرفی مهد را جایگزین کنید. */}`. The current body text is a generic template paragraph — not real content about the kindergarten's history, founding, or unique story.
**Fix:** Owner should provide: founding year, number of years in operation, team size, capacity, any awards or certifications, real story. Replace placeholder paragraph.

### HIGH — Meta descriptions thin/generic on inner pages
- About: "درباره مهدکودک آرشین و تیم مربیان آن." (34 chars — far below 120-160 optimal)
- Programs: "برنامه‌ها و گروه‌های سنی نوباوه آرشین، از شیرخوارگاه تا پیش‌دبستانی." (better but generic)
- Contact: "ثبت‌نام و تماس با مهدکودک آرشین. آدرس، شماره تماس و ساعات کاری." (OK)
**Fix:** Write unique, keyword-rich descriptions for each page, 120-160 chars.

### HIGH — No published news/blog content
News page shows "هنوز خبری منتشر نشده است." Zero news posts = zero fresh content signal and no long-tail keyword coverage.
**Fix:** Publish at minimum 3-5 posts: رویدادهای مهد، فعالیت‌های کودکان، نکات تربیتی. Use the admin CMS at /admin/news/new.

### MEDIUM — Gallery empty
Gallery page likely empty (no images uploaded). Empty gallery = low trust signal for parents evaluating the facility.
**Fix:** Upload 8-12 photos of the facility, classrooms, outdoor space via /admin/gallery.

### MEDIUM — No staff profiles
About page has staff grid but DB is empty — section hidden. Staff bios with photos build E-E-A-T (Experience/Expertise) significantly for a childcare business.
**Fix:** Add 3-5 staff members via /admin/staff/new with name, role, photo, bio.

### LOW — Homepage H1 keyword targeting
Current H1: "جایی امن و شاد برای رشد و شکوفایی کودک شما" — emotional, good UX, but misses geo keywords.
**Fix:** Consider: "مهدکودک آرشین — محیطی امن و شاد در کرج" to capture "مهدکودک کرج" searches.
