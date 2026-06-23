"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "./actions";
import { business } from "@/lib/business";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--surface-2)] p-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
        <h1 className="mb-1 text-center text-xl font-bold">ورود به پنل مدیریت</h1>
        <p className="mb-6 text-center text-sm text-[var(--text-muted)]">
          {business.name}
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              ایمیل
            </label>
            <input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              required
              className="w-full rounded-xl border border-border bg-[var(--surface)] px-4 py-3 text-right outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-border bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--accent)]"
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
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}
