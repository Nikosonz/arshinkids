import "server-only";
import { Resend } from "resend";
import { business } from "@/lib/business";

/**
 * Resend client singleton + lead notification. CLAUDE.md §9.
 * Free tier sender: onboarding@resend.dev (no domain verification needed).
 * Returns null client when RESEND_API_KEY is unset so the app still runs.
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export interface LeadEmailData {
  parentName: string;
  phone: string;
  childName?: string | null;
  childBirthYear?: number | null;
  program?: string | null;
  message?: string | null;
}

export async function sendLeadEmail(data: LeadEmailData): Promise<void> {
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!resend || !to) {
    console.warn("[email] RESEND_API_KEY or LEAD_NOTIFY_EMAIL missing — skipping");
    return;
  }

  const rows: [string, string][] = [
    ["نام والد", data.parentName],
    ["شماره تماس", data.phone],
    ["نام کودک", data.childName || "—"],
    ["سال تولد", data.childBirthYear ? String(data.childBirthYear) : "—"],
    ["برنامه", data.program || "—"],
    ["پیام", data.message || "—"],
  ];

  const html = `
    <div dir="rtl" style="font-family:Tahoma,sans-serif;line-height:1.8">
      <h2>درخواست ثبت‌نام جدید — ${esc(business.name)}</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="font-weight:bold">${esc(k)}</td><td>${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;

  await resend.emails.send({
    from: `${business.nameLatin} <onboarding@resend.dev>`,
    to,
    subject: `درخواست ثبت‌نام جدید — ${data.parentName}`,
    replyTo: to,
    html,
  });
}

/** Purchase confirmation to the customer after a verified course payment. */
export async function sendEnrollmentEmail(params: {
  to: string;
  courseTitle: string;
  refId?: string;
}): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipping enrollment email");
    return;
  }

  const html = `
    <div dir="rtl" style="font-family:Tahoma,sans-serif;line-height:1.8">
      <h2>خرید شما با موفقیت انجام شد ✅</h2>
      <p>دوره‌ی «${esc(params.courseTitle)}» به حساب شما اضافه شد.</p>
      ${params.refId ? `<p>کد پیگیری پرداخت: <b>${esc(params.refId)}</b></p>` : ""}
      <p>برای مشاهده‌ی دوره وارد حساب کاربری خود شوید.</p>
    </div>`;

  await resend.emails.send({
    from: `${business.nameLatin} <onboarding@resend.dev>`,
    to: params.to,
    subject: `خرید دوره — ${params.courseTitle}`,
    html,
  });
}
