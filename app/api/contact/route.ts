import { NextResponse, type NextRequest } from "next/server";
import { enrollSchema } from "@/lib/validation";
import { faToEn } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { sendLeadEmail } from "@/lib/server/email";
import { checkRateLimit } from "@/lib/server/rate-limit";

/**
 * Public enrollment endpoint. CLAUDE.md §9:
 * Zod validate → honeypot → rate limit → Promise.allSettled([db, email]).
 * DB write required (failure → 500). Email failure non-fatal (still 200).
 */
export async function POST(req: NextRequest) {
  // rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json(
      { error: "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const parsed = enrollSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "اطلاعات واردشده معتبر نیست." },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // honeypot: a filled "website" field means a bot — pretend success.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // Normalize Persian digits → Latin, parse, and range-check (optional field).
  let childBirthYear: number | null = null;
  if (data.childBirthYear) {
    const n = Number.parseInt(faToEn(data.childBirthYear), 10);
    if (Number.isInteger(n) && n >= 1380 && n <= 1410) childBirthYear = n;
  }

  const [dbResult, emailResult] = await Promise.allSettled([
    prisma.lead.create({
      data: {
        parentName: data.parentName,
        phone: data.phone,
        childName: data.childName || null,
        childBirthYear,
        program: data.program || null,
        message: data.message || null,
        service: "enroll",
      },
    }),
    sendLeadEmail({
      parentName: data.parentName,
      phone: data.phone,
      childName: data.childName,
      childBirthYear,
      program: data.program,
      message: data.message,
    }),
  ]);

  if (dbResult.status === "rejected") {
    console.error("[contact] db write failed:", dbResult.reason);
    return NextResponse.json(
      { error: "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }

  if (emailResult.status === "rejected") {
    // non-fatal — lead is saved, owner can see it in the admin inbox.
    console.error("[contact] email failed (non-fatal):", emailResult.reason);
  }

  return NextResponse.json({ ok: true });
}
