"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { AuthState } from "@/app/(site)/account/actions";

const initial: AuthState = {};

const inputCls =
  "w-full rounded-xl border border-border bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--accent)]";

export function AuthForm({
  mode,
  action,
  next,
}: {
  mode: "login" | "register";
  action: (prev: AuthState, fd: FormData) => Promise<AuthState>;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const isRegister = mode === "register";

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      {isRegister && (
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="name">
            نام و نام خانوادگی
          </label>
          <input id="name" name="name" required className={inputCls} />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          ایمیل
        </label>
        <input id="email" name="email" type="email" dir="ltr" required className={`${inputCls} text-right`} />
      </div>

      {isRegister && (
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="phone">
            موبایل <span className="text-[var(--text-muted)]">(اختیاری)</span>
          </label>
          <input id="phone" name="phone" type="tel" dir="ltr" className={`${inputCls} text-right`} />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={isRegister ? 6 : undefined}
          className={inputCls}
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isRegister ? "ثبت‌نام" : "ورود"}
      </button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        {isRegister ? (
          <>
            حساب دارید؟{" "}
            <Link href="/account/login" className="font-medium text-[var(--accent-hover)]">
              ورود
            </Link>
          </>
        ) : (
          <>
            حساب ندارید؟{" "}
            <Link href="/account/register" className="font-medium text-[var(--accent-hover)]">
              ثبت‌نام
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
