import { ReservationForm } from "@/components/reservation-form";
import { PageBanner } from "@/components/page-banner";
import { getSiteSettings } from "@/lib/content-store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réserver une table",
  description:
    "Réservez votre table au restaurant ABD Culinary Events à Dakar en quelques clics, par e-mail ou WhatsApp.",
};

export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageBanner
        eyebrow="Réservation"
        title="Réserver une table."
        description="Pour un groupe de plus de 30 personnes, utilisez plutôt notre formulaire de devis traiteur."
        imageUrl={settings.reservationBannerUrl}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <ReservationForm />
      </section>
    </>
  );
}
