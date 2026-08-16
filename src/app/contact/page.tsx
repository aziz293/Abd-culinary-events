import { Mail, MapPin, Phone } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/content-store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez ABD Culinary Events à Dakar par e-mail, téléphone ou WhatsApp pour toute question sur nos services de restaurant et traiteur.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Une question ? Écrivez-nous."
        description="Pour une réservation de table, utilisez plutôt la page Réservation. Pour un événement, la page Devis. Ici, c'est pour tout le reste."
        imageUrl={settings.restaurantBannerUrl}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid md:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <h2 className="font-display text-2xl mb-6">Coordonnées</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-ember" />
              <span>HLM Grand Yoff, Parking Dakar Dem Dikk</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-ember" />
              <a href="tel:+221778897668" className="hover:text-ember">77 889 76 68</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-ember" />
              <a href="mailto:abdculinaryevents@gmail.com" className="hover:text-ember">
                abdculinaryevents@gmail.com
              </a>
            </li>
          </ul>

          <div id="carte" className="mt-10 scroll-mt-28">
            <div className="aspect-[4/3] rounded-sm overflow-hidden border border-ink/10">
              <iframe
                title="Localisation ABD Culinary Events"
                src="https://www.google.com/maps?q=14.743645336109909,-17.45518581298659&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=14.743645336109909,-17.45518581298659"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 font-mono text-xs uppercase tracking-widest text-ember hover:text-ember-bright"
            >
              Ouvrir dans Google Maps
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl mb-6">Envoyer un message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
