import { business, SITE_URL } from "@/lib/business";

/** /llms.txt — concise, link-rich summary for AI search engines. CLAUDE.md §8. */
export const dynamic = "force-static";

export function GET() {
  const body = `# ${business.name}

${business.description}

## درباره
${business.name} (${business.nameLatin}) یک مهدکودک و پیش‌دبستانی است که محیطی امن، شاد و آموزشی برای کودکان فراهم می‌کند. آموزش بازی‌محور، مربیان آموزش‌دیده و تغذیه‌ی سالم از ویژگی‌های ماست.

## صفحات کلیدی
- [خانه](${SITE_URL}/)
- [برنامه‌ها و گروه‌های سنی](${SITE_URL}/programs)
- [درباره ما و کادر آموزشی](${SITE_URL}/about)
- [گالری تصاویر](${SITE_URL}/gallery)
- [اخبار و اطلاعیه‌ها](${SITE_URL}/news)
- [تماس و ثبت‌نام](${SITE_URL}/contact)

## تماس
- تلفن: ${business.phone}
- ایمیل: ${business.email}
- نشانی: ${business.address.street}، ${business.address.city}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
