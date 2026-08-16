import { DevisForm } from "@/components/devis-form";
import { PageBanner } from "@/components/page-banner";
import { getSiteSettings } from "@/lib/content-store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devis traiteur",
  description:
    "Demandez un devis gratuit pour votre événement avec ABD Culinary Events : mariage, séminaire, anniversaire. Réponse sous 48 heures.",
};

export const dynamic = "force-dynamic";

export default async function DevisPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageBanner
        eyebrow="Devis traiteur"
        title="Racontez-nous votre événement."
        description="Quatre étapes, deux minutes. Nous revenons vers vous avec une proposition adaptée à votre budget."
        imageUrl={settings.devisBannerUrl}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <DevisForm />
      </section>
    </>
  );
}
