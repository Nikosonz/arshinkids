import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Camera, Send } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { business } from "@/lib/business";
import { Container } from "./container";

export function SiteFooter() {
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  );

  return (
    <footer className="mt-auto border-t border-border bg-[var(--surface-2)]">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        {/* brand */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-lg font-bold">
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-[var(--accent-contrast)]"
              style={{ background: "var(--accent)" }}
              aria-hidden
            >
              آ
            </span>
            {business.name}
          </div>
          <p className="text-sm leading-7 text-[var(--text-muted)]">
            {business.description}
          </p>
        </div>

        {/* links */}
        <div>
          <h3 className="mb-3 font-semibold">دسترسی سریع</h3>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[var(--accent-hover)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h3 className="mb-3 font-semibold">تماس با ما</h3>
          <ul className="space-y-3 text-sm text-[var(--text-muted)]">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span>
                {business.address.street}، {business.address.city}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <a href={`tel:${business.phone}`} className="bidi-plaintext">
                {business.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <a href={`mailto:${business.email}`} className="bidi-plaintext">
                {business.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span>شنبه تا چهارشنبه، ۸ تا ۱۶</span>
            </li>
          </ul>

          {(business.socials.instagram || business.socials.telegram) && (
            <div className="mt-4 flex gap-3">
              {business.socials.instagram && (
                <a
                  href={business.socials.instagram}
                  aria-label="اینستاگرام"
                  className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)] text-[var(--accent)]"
                >
                  <Camera className="h-4 w-4" />
                </a>
              )}
              {business.socials.telegram && (
                <a
                  href={business.socials.telegram}
                  aria-label="تلگرام"
                  className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)] text-[var(--accent)]"
                >
                  <Send className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </Container>

      <div className="border-t border-border py-5 text-center text-xs text-[var(--text-muted)]">
        © {year} {business.name}. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
