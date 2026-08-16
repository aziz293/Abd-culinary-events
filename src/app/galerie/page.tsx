import { GalleryBrowser } from "@/components/gallery-browser";
import { PageBanner } from "@/components/page-banner";
import { getGalleryItems, getSiteSettings } from "@/lib/content-store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Photos et vidéos des mariages, buffets et événements d'entreprise organisés par ABD Culinary Events à Dakar.",
};

export const dynamic = "force-dynamic";

export default async function GaleriePage() {
  const [items, settings] = await Promise.all([getGalleryItems(), getSiteSettings()]);
  return (
    <>
      <PageBanner
        eyebrow="Galerie"
        title="Nos événements, en images."
        imageUrl={settings.galerieBannerUrl}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <GalleryBrowser items={items} />
      </section>
    </>
  );
}
