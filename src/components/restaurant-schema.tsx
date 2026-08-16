export function RestaurantSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "ABD Culinary Events",
    image: "https://abdculinaryevents.sn/brand/abd-logo.png",
    servesCuisine: ["Sénégalaise", "Traiteur"],
    priceRange: "$$",
    telephone: "+221778897668",
    email: "abdculinaryevents@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "HLM Grand Yoff, Parking Dakar Dem Dikk",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 14.743645336109909,
      longitude: -17.45518581298659,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "12:00",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "19:00",
        closes: "23:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/abddiarra/",
      "https://snapchat.com/t/Oif0WwY1",
      "https://www.tiktok.com/@abd_culinary_events",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
