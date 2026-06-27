import { prisma } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, course: true },
      take: 200,
    });
  } catch {
    return [];
  }
}

const STATUS: Record<string, { label: string; cls: string }> = {
  PAID: { label: "پرداخت شده", cls: "bg-green-100 text-green-700" },
  PENDING: { label: "در انتظار", cls: "bg-amber-100 text-amber-700" },
  FAILED: { label: "ناموفق", cls: "bg-red-100 text-red-700" },
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <AdminHeader title="سفارش‌ها" />
      {orders.length === 0 ? (
        <Card>
          <p className="text-[var(--text-muted)]">هنوز سفارشی ثبت نشده است.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const s = STATUS[o.status] ?? STATUS.PENDING;
            return (
              <Card key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <div className="font-bold">{o.course.title}</div>
                  <div className="text-sm text-[var(--text-muted)]" dir="ltr">
                    {o.customer.email}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {formatDate(o.createdAt)}
                    {o.refId ? ` — کد پیگیری: ${o.refId}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatPrice(o.amount)}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
