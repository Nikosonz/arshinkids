import type { Metadata } from "next";
import { vazirmatn } from "./fonts";
import { business, SITE_URL } from "@/lib/business";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${business.name} | ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: business.name,
    title: `${business.name} | ${business.tagline}`,
    description: business.description,
    url: SITE_URL,
    // og:image is provided automatically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | ${business.tagline}`,
    description: business.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
