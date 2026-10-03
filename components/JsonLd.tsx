import { sitePhoneTel, siteUrl } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/types";

type Props = {
  dict: Dictionary;
  locale: string;
};

export default function JsonLd({ dict, locale }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: "12 FEET",
    description: dict.meta.description,
    url: `${siteUrl}/${locale}`,
    telephone: sitePhoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Záhradnícka 36",
      addressLocality: "Bratislava",
      addressCountry: "SK",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "12:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "12:00",
        closes: "00:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "14:00",
        closes: "22:00",
      },
    ],
    priceRange: "€€",
    servesCuisine: "Coffee, tea, beer",
    amenityFeature: ["Billiard table", "Russian pyramid"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
