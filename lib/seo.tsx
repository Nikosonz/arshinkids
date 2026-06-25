import { business, SITE_URL } from "./business";

/** Render a JSON-LD <script>. Escapes < to avoid breaking out of the tag. */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

/** LocalBusiness schema for a kindergarten (Preschool + ChildCare). */
export function localBusinessSchema() {
  const hasGeo = Boolean(business.geo.lat) && Boolean(business.geo.lng);

  return {
    "@context": "https://schema.org",
    "@type": ["Preschool", "ChildCare"],
    "@id": `${SITE_URL}#organization`,
    name: business.name,
    alternateName: business.nameLatin,
    description: business.description,
    url: SITE_URL,
    telephone: business.phone,
    email: business.email,
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode || undefined,
      addressCountry: business.address.country,
    },
    ...(hasGeo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: business.geo.lat,
        longitude: business.geo.lng,
      },
    }),
    openingHoursSpecification: business.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    ...(business.socials.instagram || business.socials.telegram
      ? {
          sameAs: [business.socials.instagram, business.socials.telegram].filter(
            Boolean,
          ),
        }
      : {}),
  };
}

/** FAQPage schema from the FAQ list. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
