/**
 * Single source of truth for NAP (Name / Address / Phone) and other business
 * facts. Used by the footer, contact page, JSON-LD schema, and metadata so
 * everything stays consistent. § CLAUDE.md §8.
 *
 * TODO(owner): replace the placeholder values below with the real details from
 * the Google Business listing (address, phone, city, hours, geo, socials).
 */

export const SITE_URL = "https://arshinkids.com";

export const business = {
  /** Persian display name */
  name: "مهدکودک آرشین",
  /** Latin name for schema / OG */
  nameLatin: "Arshin Kids",
  tagline: "مهدکودک و پیش‌دبستانی آرشین", // TODO: confirm wording
  description:
    "مهدکودک آرشین، محیطی امن، شاد و آموزشی برای رشد و شکوفایی کودکان شما.", // TODO: confirm

  // --- NAP (TODO: fill from real listing) ---
  phone: "+98-000-000-0000", // TODO
  phoneDisplay: "۰۰۰ ۰۰۰ ۰۰۰۰", // TODO Persian display
  email: "info@arshinkids.com", // TODO confirm
  address: {
    street: "TODO نشانی کامل", // TODO
    city: "TODO شهر", // TODO
    region: "TODO استان", // TODO
    postalCode: "", // TODO
    country: "IR",
  },
  /** Map coordinates — TODO from Google Maps listing */
  geo: {
    lat: 0, // TODO
    lng: 0, // TODO
  },
  /** Opening hours in schema.org format. TODO confirm real hours. */
  openingHours: [
    { days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"], opens: "07:30", closes: "16:00" },
  ],

  socials: {
    instagram: "", // TODO e.g. https://instagram.com/...
    telegram: "", // TODO
    whatsapp: "", // TODO
  },
} as const;
