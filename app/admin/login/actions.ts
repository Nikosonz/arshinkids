"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/server/password";
import { createSession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "ایمیل یا رمز عبور نادرست است." };

  let ok = false;
  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: parsed.data.email },
    });
    ok = !!user && verifyPassword(parsed.data.password, user.passwordHash);
    if (ok && user) await createSession(user.id);
  } catch (err) {
    console.error("[login] error:", err);
    return { error: "خطا در ورود. لطفاً دوباره تلاش کنید." };
  }

  if (!ok) return { error: "ایمیل یا رمز عبور نادرست است." };
  redirect("/admin");
}
