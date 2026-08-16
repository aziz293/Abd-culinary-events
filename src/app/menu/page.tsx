import { MenuBrowser } from "@/components/menu-browser";
import { PageBanner } from "@/components/page-banner";
import { getMenuItems, getSiteSettings } from "@/lib/content-store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le menu",
  description:
    "La carte du restaurant ABD Culinary Events : burgers, sandwichs, chawarmas, tacos, plats sénégalais, desserts et pâtisseries maison à Dakar.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [items, settings] = await Promise.all([getMenuItems(), getSiteSettings()]);
  const visibleItems = items.filter(
    (item) =>
      item.category !== "plats" &&
      item.id !== settings.dishOfTheDayId &&
      item.id !== settings.eveningDishId
  );
  return (
    <>
      <PageBanner
        eyebrow="Le menu"
        title="La carte du moment."
        description="Prix indicatifs en francs CFA. La carte évolue avec les arrivages du marché ; certains plats peuvent être temporairement indisponibles."
        imageUrl={settings.menuBannerUrl}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <MenuBrowser items={visibleItems} />
      </section>
    </>
  );
}
