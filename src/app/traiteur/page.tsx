import Link from "next/link";
import { ArrowRight, Cake, Coffee, Heart, Briefcase } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { PageBanner } from "@/components/page-banner";
import { getEventOffers, getSiteSettings } from "@/lib/content-store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service traiteur",
  description:
    "Service traiteur événementiel à Dakar : mariages, cocktails d'entreprise, anniversaires et pâtisserie sur-mesure, pour cent à mille invités.",
};

export const dynamic = "force-dynamic";

const iconMap = { heart: Heart, briefcase: Briefcase, cake: Cake, coffee: Coffee };

const steps = [
  { n: "01", title: "Vous décrivez l'événement", text: "Type, date, lieu et nombre d'invités, en quelques minutes via le simulateur." },
  { n: "02", title: "Nous vous rappelons", text: "L'équipe affine le menu, le format de service et le budget avec vous." },
  { n: "03", title: "Dégustation & validation", text: "Un rendez-vous de dégustation avant confirmation définitive de la commande." },
  { n: "04", title: "Le jour J", text: "Installation, service et rangement pris en charge du début à la fin." },
];

export default async function TraiteurPage() {
  const [eventOffers, settings] = await Promise.all([getEventOffers(), getSiteSettings()]);
  return (
    <>
      <PageBanner
        eyebrow="Service traiteur"
        title="La même cuisine, pour cent ou mille invités."
        description="Mariages, cocktails d'entreprise, anniversaires et pâtisserie sur-mesure : un seul interlocuteur, du premier appel au dernier service."
        imageUrl={settings.traiteurBannerUrl}
      >
        <Link
          href="/devis"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ember hover:bg-ember-bright rounded-full font-mono text-xs uppercase tracking-widest transition-colors text-ink"
        >
          Démarrer un devis <ArrowRight size={14} />
        </Link>
      </PageBanner>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <SectionHeading eyebrow="Nos prestations" title="Un format pour chaque occasion" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {eventOffers.map((offer) => {
            const Icon = iconMap[offer.icon];
            return (
              <div key={offer.id} className="border border-ink/10 rounded-sm bg-cream-dim overflow-hidden">
                {offer.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={offer.imageUrl} alt={offer.title} className="w-full aspect-[4/3] object-cover" />
                )}
                <div className="p-6">
                  <Icon className="text-ember" size={22} />
                  <h3 className="font-display text-lg mt-4">{offer.title}</h3>
                  <p className="mt-2 text-base text-ink/85 leading-relaxed">{offer.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-cream-dim py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading eyebrow="Le déroulé" title="De la demande au service" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.n}>
                <span className="font-mono text-sm text-brass">{step.n}</span>
                <h3 className="font-display text-lg mt-2">{step.title}</h3>
                <p className="mt-2 text-base text-ink/85 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 text-center">
        <SectionHeading
          eyebrow="Votre événement"
          title="Un devis clair en quatre étapes"
          align="center"
          className="mx-auto"
        />
        <Link
          href="/devis"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-ember hover:bg-ember-bright text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
        >
          Demander un devis traiteur <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
