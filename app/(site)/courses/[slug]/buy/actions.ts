"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCustomerId } from "@/lib/customer-session";
import { requestPayment, isZarinpalEnabled } from "@/lib/server/zarinpal";
import { SITE_URL } from "@/lib/business";

/**
 * Start a Zarinpal checkout for a course. Bound to the buy page form (courseId +
 * slug in hidden fields). Creates a PENDING order, asks Zarinpal for an
 * authority, then redirects the user to the gateway. The callback route verifies
 * and grants the enrollment.
 */
export async function startCheckout(fd: FormData) {
  const courseId = String(fd.get("courseId") ?? "");
  const slug = String(fd.get("slug") ?? "");

  const customerId = await getCustomerId();
  if (!customerId) {
    redirect(`/account/login?next=/courses/${encodeURIComponent(slug)}/buy`);
  }

  if (!isZarinpalEnabled()) redirect(`/courses/${slug}/buy?status=disabled`);

  const course = await prisma.course.findFirst({
    where: { id: courseId, published: true, accessType: "PAID" },
  });
  if (!course || !course.price) redirect(`/courses/${slug}`);

  // already owns it → no need to pay again
  const owned = await prisma.enrollment.count({
    where: { customerId, courseId },
  });
  if (owned > 0) redirect(`/courses/${slug}`);

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  const order = await prisma.order.create({
    data: { customerId, courseId, amount: course.price, status: "PENDING" },
  });

  const result = await requestPayment({
    amountToman: course.price,
    description: `خرید دوره: ${course.title}`,
    callbackUrl: `${SITE_URL}/api/checkout/callback`,
    email: customer?.email,
    mobile: customer?.phone,
  });

  if (!result.ok || !result.authority || !result.startPayUrl) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    redirect(`/courses/${slug}/buy?status=error`);
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { authority: result.authority },
  });

  redirect(result.startPayUrl);
}
