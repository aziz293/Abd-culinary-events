import Link from "next/link";
import { ArrowRight, Award, Clock, Leaf, Mail, MapPin, Phone, Salad, ChefHat, HeartHandshake, Users, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { PageBanner } from "@/components/page-banner";
import { Reveal } from "@/components/reveal";
import { InstagramIcon, SnapchatIcon, TikTokIcon } from "@/components/brand-icons";
import { getSiteSettings } from "@/lib/content-store";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le restaurant",
  description:
    "Découvrez le restaurant ABD Culinary Events à Dakar : cuisine sénégalaise authentique, produits frais du marché, accueil chaleureux. Réservez votre table.",
};

export const dynamic = "force-dynamic";

const strengths = [
  { text: "Une cuisine sénégalaise authentique et généreuse", icon: ChefHat },
  { text: "Des produits frais choisis chaque matin au marché", icon: Salad },
  { text: "Un service traiteur sur mesure, du privé à mille invités", icon: Users },
  { text: "Une pâtisserie maison, pièce montée comprise", icon: Sparkles },
  { text: "Un accueil chaleureux, à table comme en cuisine", icon: HeartHandshake },
  { text: "Un rapport qualité/prix pensé pour Dakar", icon: Award },
  { text: "Un service traiteur disponible 7j/7", icon: Clock },
];

export default async function RestaurantPage() {
  const settings = await getSiteSettings();
  const whatsappNumber = settings.whatsappNumber || "221778897668";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Bonjour ABD Culinary Events, je souhaite avoir plus d'informations."
  )}`;

  return (
    <>
      <PageBanner
        eyebrow="Le restaurant"
        title="Une table à Dakar, fidèle au marché et au terroir."
        imageUrl={settings.restaurantBannerUrl}
      />

      {/* CHEF */}
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-[4/3] rounded-sm overflow-hidden border border-ink/10 order-2 md:order-1 relative">
          {settings.restaurantChefImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.restaurantChefImageUrl} alt="Le chef d'ABD Culinary Events" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ember/25 via-brass/20 to-noir/10" />
          )}
        </div>
        <div className="order-1 md:order-2">
          <SectionHeading
            eyebrow="Le chef"
            title="Une cuisine forgée par l’expérience, affinée avec passion"
            description="Formée dans les cuisines sénégalaises, la cheffe a grandi avec une idée simple : faire découvrir le Sénégal à travers une cuisine authentique, généreuse et sans artifice. Chaque produit est choisi avec soin et chaque recette met à l’honneur les saveurs et le savoir-faire de notre terroir. La carte évolue au fil des saisons, mais la passion et l’exigence restent toujours les mêmes."
          />
        </div>
      </Reveal>

      {/* CITATION */}
      <div className="px-3 lg:px-6 pb-10">
        <Reveal className="max-w-6xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-brass to-brass-bright px-8 sm:px-14 py-12 sm:py-16">
          <div className="flex gap-5 sm:gap-8 max-w-3xl">
            <span className="w-1 shrink-0 bg-ink/70 rounded-full" />
            <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug text-ink">
              Nous mettons chaque client au cœur de notre cuisine, avec la même exigence à chaque
              assiette, du premier au dernier convive.
            </blockquote>
          </div>
        </Reveal>
      </div>

      {/* ARGUMENTS */}
      <div className="px-3 lg:px-6 pb-20">
        <Reveal className="max-w-6xl mx-auto rounded-[2rem] overflow-hidden bg-cream border border-ink/10 grid md:grid-cols-2">
          <div className="relative min-h-[320px] md:min-h-[560px] order-2 md:order-1">
            {settings.restaurantStrengthsImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.restaurantStrengthsImageUrl}
                alt="ABD Culinary Events"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-noir via-noir-soft to-brass/30" />
            )}
          </div>

          <div className="px-8 sm:px-12 py-12 sm:py-16 order-1 md:order-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember mb-4">
              La meilleure adresse
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-ink mb-8">
              ABD Culinary Events, c&apos;est avant tout :
            </h2>
            <ul className="space-y-3">
              {strengths.map((s) => (
                <li
                  key={s.text}
                  className="group flex items-center gap-3 bg-brass/90 rounded-lg px-4 py-3"
                >
                  <s.icon size={16} className="text-ink shrink-0 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-6" />
                  <span className="text-sm sm:text-base font-medium text-ink">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* CONTACT + CARTE */}
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-10 items-stretch">
        <div className="bg-noir text-cream rounded-[1.5rem] p-8 sm:p-10 flex flex-col">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-bright mb-2">
            Nous rendre visite
          </p>
          <h2 className="font-display text-2xl sm:text-3xl mb-6">Un accueil chaleureux</h2>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:brightness-95 text-white rounded-full font-mono text-xs uppercase tracking-widest transition-all mb-8"
          >
            Nous écrire sur WhatsApp
          </a>

          <ul className="space-y-3 text-sm mb-8">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-brass shrink-0" />
              <a href="tel:+221778897668" className="hover:text-brass-bright">
                77 889 76 68 (téléphone / WhatsApp)
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-brass shrink-0" />
              <span>HLM Grand Yoff, Parking Dakar Dem Dikk</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-brass shrink-0" />
              <a href="mailto:abdculinaryevents@gmail.com" className="hover:text-brass-bright">
                abdculinaryevents@gmail.com
              </a>
            </li>
          </ul>

          <div className="border-t border-brass/20 pt-6 mb-8">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brass-bright mb-3">
              <Clock size={14} /> Horaires &amp; service
            </p>
            <p className="text-sm text-cream/80">Restaurant : Lundi – Dimanche, 09h – 00h</p>
            <p className="text-sm text-cream/80 mt-1">Service traiteur : 7j/7, 24h/24</p>
          </div>

          <div className="flex gap-4 mt-auto">
            <a href="https://www.instagram.com/abddiarra/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brass-bright">
              <InstagramIcon />
            </a>
            <a href="https://snapchat.com/t/Oif0WwY1" target="_blank" rel="noopener noreferrer" aria-label="Snapchat" className="hover:text-brass-bright">
              <SnapchatIcon />
            </a>
            <a href="https://www.tiktok.com/@abd_culinary_events" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-brass-bright">
              <TikTokIcon />
            </a>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 min-h-[320px] rounded-[1.5rem] overflow-hidden border border-ink/10">
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
      </Reveal>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 text-center">
        <SectionHeading
          eyebrow="Réserver"
          title="Une table vous attend"
          align="center"
          className="mx-auto"
        />
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/reservation"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ember hover:bg-ember-bright text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Réserver une table <ArrowRight size={14} />
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 border border-ink/20 hover:border-ember hover:text-ember rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Voir le menu
          </Link>
        </div>
      </section>
    </>
  );
}
