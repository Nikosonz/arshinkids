import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPayment } from "@/lib/server/zarinpal";
import { sendEnrollmentEmail } from "@/lib/server/email";
import { SITE_URL } from "@/lib/business";

/**
 * Zarinpal callback. The gateway redirects here with ?Authority=&Status=OK|NOK
 * after the user pays. We verify with Zarinpal, mark the order PAID, and grant
 * the enrollment (idempotent). CLAUDE.md §9.
 */
export async function GET(req: NextRequest) {
  const authority = req.nextUrl.searchParams.get("Authority") ?? "";
  const status = req.nextUrl.searchParams.get("Status") ?? "";

  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, SITE_URL));

  if (!authority) return redirectTo("/courses?status=error");

  const order = await prisma.order
    .findUnique({ where: { authority }, include: { course: true, customer: true } })
    .catch(() => null);

  if (!order) return redirectTo("/courses?status=error");

  const buyPath = `/courses/${order.course.slug}/buy`;

  // already granted (double callback / refresh)
  if (order.status === "PAID") {
    return redirectTo(`/courses/${order.course.slug}?status=success`);
  }

  // user cancelled at the gateway
  if (status !== "OK") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return redirectTo(`${buyPath}?status=failed`);
  }

  const verified = await verifyPayment({
    authority,
    amountToman: order.amount,
  });

  if (!verified.ok) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return redirectTo(`${buyPath}?status=failed`);
  }

  // mark paid + grant access atomically; enrollment is unique per (customer,course)
  try {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", refId: verified.refId ?? null, paidAt: new Date() },
      }),
      prisma.enrollment.upsert({
        where: {
          customerId_courseId: {
            customerId: order.customerId,
            courseId: order.courseId,
          },
        },
        create: {
          customerId: order.customerId,
          courseId: order.courseId,
          orderId: order.id,
        },
        update: {},
      }),
    ]);
  } catch (err) {
    console.error("[checkout] grant failed:", err);
    return redirectTo(`${buyPath}?status=error`);
  }

  // confirmation email — non-fatal
  try {
    if (order.customer?.email) {
      await sendEnrollmentEmail({
        to: order.customer.email,
        courseTitle: order.course.title,
        refId: verified.refId,
      });
    }
  } catch (err) {
    console.error("[checkout] email failed (non-fatal):", err);
  }

  return redirectTo(`/courses/${order.course.slug}?status=success`);
}
