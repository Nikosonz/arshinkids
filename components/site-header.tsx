"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { business } from "@/lib/business";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--surface)]/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image
            src="/logo.jpg"
            alt={business.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
            priority
          />
          <span>{business.name}</span>
        </Link>

        {/* desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]",
                  isActive(link.href) &&
                    "bg-[var(--accent-subtle)] text-[var(--accent-hover)]",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            ثبت‌نام
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-[var(--text-primary)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-border bg-[var(--surface)] md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 font-medium text-[var(--text-muted)]",
                    isActive(link.href) &&
                      "bg-[var(--accent-subtle)] text-[var(--accent-hover)]",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl bg-[var(--accent)] px-4 py-3 text-center font-semibold text-[var(--accent-contrast)]"
              >
                ثبت‌نام
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
