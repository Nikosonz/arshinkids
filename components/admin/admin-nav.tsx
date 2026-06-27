"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Puzzle,
  Users,
  Images,
  Newspaper,
  GraduationCap,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/leads", label: "درخواست‌ها", icon: Inbox },
  { href: "/admin/programs", label: "برنامه‌ها", icon: Puzzle },
  { href: "/admin/staff", label: "کادر آموزشی", icon: Users },
  { href: "/admin/gallery", label: "گالری", icon: Images },
  { href: "/admin/news", label: "اخبار", icon: Newspaper },
  { href: "/admin/courses", label: "دوره‌ها", icon: GraduationCap },
  { href: "/admin/orders", label: "سفارش‌ها", icon: Receipt },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-subtle)] hover:text-[var(--accent-hover)]",
            isActive(item.href) &&
              "bg-[var(--accent-subtle)] text-[var(--accent-hover)]",
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
