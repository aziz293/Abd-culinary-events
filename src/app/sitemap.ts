import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abd-culinary-events-rouge.vercel.app/";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/restaurant",
    "/menu",
    "/reservation",
    "/traiteur",
    "/devis",
    "/galerie",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
