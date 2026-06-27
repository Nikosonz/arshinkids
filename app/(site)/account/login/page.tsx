import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { AuthForm } from "@/components/account/auth-form";
import { getCustomerId } from "@/lib/customer-session";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "ورود",
  robots: { index: false },
};

type Search = { searchParams: Promise<{ next?: string }> };

export default async function CustomerLoginPage({ searchParams }: Search) {
  if (await getCustomerId()) redirect("/account");
  const { next } = await searchParams;

  return (
    <div className="py-20">
      <Container className="max-w-sm">
        <div className="rounded-3xl border border-border bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <h1 className="mb-6 text-center text-xl font-bold">ورود به حساب</h1>
          <AuthForm mode="login" action={loginAction} next={next} />
        </div>
      </Container>
    </div>
  );
}
