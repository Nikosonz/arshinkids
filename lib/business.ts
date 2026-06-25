/**
 * Single source of truth for NAP (Name / Address / Phone) and other business
 * facts. Used by the footer, contact page, JSON-LD schema, and metadata so
 * everything stays consistent. § CLAUDE.md §8.
 */

// Canonical host = www (Vercel serves www; apex 308-redirects to it).
// Keep this in sync with the Vercel Domains "primary domain" setting.
export const SITE_URL = "https://www.arshinkids.com";

export const business = {
  /** Persian display name */
  name: "مهدکودک آرشین",
  /** Latin name for schema / OG */
  nameLatin: "Arshin Kids",
  tagline: "مهدکودک و پیش‌دبستانی آرشین",
  description:
    "مهدکودک آرشین، محیطی امن، شاد و آموزشی برای رشد و شکوفایی کودکان شما.",

  // --- NAP ---
  phone: "+982634450160",
  phoneDisplay: "۰۲۶-۳۴۴۵-۰۱۶۰",
  email: "info@arshinkids.com",
  address: {
    street: "جهانشهر، میدان هلال احمر، خیابان فریما",
    city: "کرج",
    region: "البرز",
    postalCode: "",
    country: "IR",
  },
  /** Google Maps coordinates */
  geo: {
    lat: 35.82599204195466,
    lng: 50.98599854418575,
  },
  /** Opening hours in schema.org format — شنبه تا چهارشنبه ۸ تا ۱۶ */
  openingHours: [
    { days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"], opens: "08:00", closes: "16:00" },
  ],

  socials: {
    instagram: "https://www.instagram.com/arshinkids/",
    telegram: "https://t.me/arshin_mahd",
    whatsapp: "",
  },
} as const;
