"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import {
  createCustomerSession,
  deleteCustomerSession,
} from "@/lib/customer-session";
import { customerLoginSchema, customerRegisterSchema } from "@/lib/validation";

export interface AuthState {
  error?: string;
}

/** Where to send the user after a successful login/register (internal paths only). */
function safeNext(next: unknown): string {
  const v = typeof next === "string" ? next : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/account";
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = customerRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "اطلاعات نادرست است." };
  }

  const { name, email, phone, password } = parsed.data;
  let customerId: string | null = null;
  try {
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return { error: "این ایمیل قبلاً ثبت شده است." };

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: hashPassword(password),
      },
    });
    customerId = customer.id;
  } catch (err) {
    console.error("[register] error:", err);
    return { error: "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید." };
  }

  await createCustomerSession(customerId);
  redirect(safeNext(formData.get("next")));
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = customerLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "ایمیل یا رمز عبور نادرست است." };

  let id: string | null = null;
  try {
    const customer = await prisma.customer.findUnique({
      where: { email: parsed.data.email },
    });
    if (customer && verifyPassword(parsed.data.password, customer.passwordHash)) {
      id = customer.id;
    }
  } catch (err) {
    console.error("[customer-login] error:", err);
    return { error: "خطا در ورود. لطفاً دوباره تلاش کنید." };
  }

  if (!id) return { error: "ایمیل یا رمز عبور نادرست است." };
  await createCustomerSession(id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  await deleteCustomerSession();
  redirect("/");
}
