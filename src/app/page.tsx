import Link from "next/link";
export const dynamic = "force-dynamic";
import { ArrowRight, Cake, Coffee, Heart, Briefcase, Salad, ChefHat, MapPinned } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { PageBanner } from "@/components/page-banner";
import { MenuItemCard } from "@/components/menu-item-card";
import { FeaturedDishCard } from "@/components/featured-dish-card";
import { Carousel } from "@/components/carousel";
import { Reveal } from "@/components/reveal";
import { getMenuItems, getEventOffers, getGalleryItems, getSiteSettings, getTestimonials } from "@/lib/content-store";
import type { Testimonial } from "@/lib/content-store";
import { cn } from "@/lib/utils";

const iconMap = { heart: Heart, briefcase: Briefcase, cake: Cake, coffee: Coffee };

const offerGradients: Record<string, string> = {
  mariage: "from-ember/30 via-brass/20 to-noir/10",
  entreprise: "from-noir/25 via-brass/15 to-herb/10",
  anniversaire: "from-brass/30 via-cream-dim to-ember/15",
  patisserie: "from-herb/20 via-brass/25 to-ember/15",
};

const benefits = [
  { icon: Salad, title: "Produits du marché", text: "Sélectionnés chaque matin à Kermel et chez les maraîchers des Niayes." },
  { icon: ChefHat, title: "Service sur mesure", text: "De la table pour deux au buffet de mille invités, même exigence." },
  { icon: MapPinned, title: "Fait à Dakar", text: "Une cuisine ancrée dans le terroir sénégalais, sans détour." },
];

const newsGradients: Record<string, string> = {
  Buffets: "from-ember/30 via-brass/20 to-noir/10",
  "Pâtisserie": "from-brass/30 via-cream-dim to-ember/10",
  Mariages: "from-herb/20 via-brass/25 to-ember/15",
  "Événements d'entreprise": "from-noir/20 via-brass/15 to-herb/10",
};

export default async function Home() {
  const [menuItems, eventOffers, galleryItems, settings, testimonials] = await Promise.all([
    getMenuItems(),
    getEventOffers(),
    getGalleryItems(),
    getSiteSettings(),
    getTestimonials(),
  ]);
  const signatureDishes = menuItems.filter((m) => m.isChefSelection);
  const dishOfTheDay = menuItems.find((m) => m.id === settings.dishOfTheDayId);
  const eveningDish = menuItems.find((m) => m.id === settings.eveningDishId);
  const recentEvents = galleryItems.slice(-8).reverse();

  return (
    <>
      {/* HERO */}
      <PageBanner
        eyebrow="Restaurant & Traiteur — Dakar"
        title="La cuisine sénégalaise, servie avec exigence."
        description="Table et service traiteur à Dakar. Du thiéboudieune du dimanche aux mariages de mille invités, chaque plat sort de la même cuisine, avec la même rigueur."
        imageUrl={settings.heroImageUrl}
      >
        <div className="flex flex-wrap gap-4">
          <Link
            href="/reservation"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-ember hover:bg-ember-bright text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Réserver une table <ArrowRight size={14} />
          </Link>
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-brass/50 hover:border-brass-bright hover:text-brass-bright rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Demander un devis traiteur
          </Link>
        </div>
      </PageBanner>

      {/* BENEFITS */}
      <section className="bg-cream-dim">
        <Reveal className="mx-auto max-w-6xl px-5 sm:px-8 py-10 grid sm:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="group flex items-start gap-4">
              <b.icon className="text-ember shrink-0 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-6" size={26} />
              <div>
                <p className="font-display text-base">{b.title}</p>
                <p className="text-base text-ink/85 mt-1 leading-snug">{b.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* PLAT DU JOUR & PLAT DU SOIR */}
      {(dishOfTheDay || eveningDish) && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
          <Reveal>
            <Carousel itemClassName="w-full">
              {[
                ...(dishOfTheDay
                  ? [<FeaturedDishCard key="jour" item={dishOfTheDay} badgeLabel="Plat du jour" badgeClassName="bg-ember text-ink" />]
                  : []),
                ...(eveningDish
                  ? [<FeaturedDishCard key="soir" item={eveningDish} badgeLabel="Plat du soir" badgeClassName="bg-brass text-ink" />]
                  : []),
              ]}
            </Carousel>
          </Reveal>
        </section>
      )}

      {/* CONCEPT */}
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            eyebrow="Le concept"
            title="Une cuisine de marché, un service d'événement."
            description="ABD Culinary Events est né d'une conviction simple : la cuisine sénégalaise gagne à être servie avec le même soin en salle qu'à mille couverts. Le chef compose sa carte au rythme du marché Kermel et transporte la même exigence sur chaque événement, du petit-déjeuner d'affaires au mariage de fin d'année."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[4/5] rounded-sm border border-ink/10 overflow-hidden relative">
            {settings.conceptImage1Url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.conceptImage1Url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ember/25 via-brass/20 to-noir/10" />
            )}
          </div>
          <div className="aspect-[4/5] rounded-sm border border-ink/10 mt-8 overflow-hidden relative">
            {settings.conceptImage2Url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.conceptImage2Url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-herb/20 via-brass/15 to-noir/10" />
            )}
          </div>
        </div>
      </Reveal>

      {/* SIGNATURE DISHES */}
      <section className="bg-cream-dim py-20">
        <Reveal className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <SectionHeading eyebrow="À la carte" title="Les suggestions du chef" />
            <Link
              href="/menu"
              className="font-mono text-xs uppercase tracking-widest text-ember inline-flex items-center gap-2 hover:text-ember-bright"
            >
              Voir le menu complet <ArrowRight size={14} />
            </Link>
          </div>
          <Carousel itemClassName="w-[280px] sm:w-[320px]">
            {signatureDishes.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </Carousel>
        </Reveal>
      </section>

      {/* EVENT OFFERS */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <Reveal>
        <SectionHeading
          eyebrow="Traiteur & événementiel"
          title="Un service pensé pour chaque occasion"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {eventOffers.map((offer) => {
            const Icon = iconMap[offer.icon];
            return (
              <div
                key={offer.id}
                className="group border border-ink/10 rounded-sm bg-cream hover:border-brass/50 transition-colors overflow-hidden"
              >
                <div
                  className={cn(
                    "aspect-[4/3] relative",
                    !offer.imageUrl && "bg-gradient-to-br",
                    !offer.imageUrl && offerGradients[offer.id]
                  )}
                >
                  {offer.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={offer.imageUrl} alt={offer.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-6">
                  <Icon className="text-ember transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-6" size={22} />
                  <h3 className="font-display text-lg mt-4">{offer.title}</h3>
                  <p className="mt-2 text-base text-ink/85 leading-relaxed">{offer.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-noir text-cream rounded-full font-mono text-xs uppercase tracking-widest hover:bg-noir-soft transition-colors"
          >
            Demander un devis traiteur <ArrowRight size={14} />
          </Link>
        </div>
        </Reveal>
      </section>

      {/* ACTUALITÉS / RECENT EVENTS */}
      {recentEvents.length > 0 && (
        <section className="bg-cream-dim py-20">
          <Reveal className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <SectionHeading eyebrow="Nos derniers événements" title="Ça s'est passé récemment" />
              <Link
                href="/galerie"
                className="font-mono text-xs uppercase tracking-widest text-ember inline-flex items-center gap-2 hover:text-ember-bright"
              >
                Voir toute la galerie <ArrowRight size={14} />
              </Link>
            </div>
            <Carousel itemClassName="w-[260px] sm:w-[300px]">
              {recentEvents.map((event) => {
                const cover = event.images?.[0];
                return (
                  <Link key={event.id} href="/galerie" className="group block">
                    <div
                      className={cn(
                        "aspect-[4/3] rounded-sm border border-ink/10 overflow-hidden relative",
                        !cover && "bg-gradient-to-br",
                        !cover && newsGradients[event.category]
                      )}
                    >
                      {cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ember">{event.category}</p>
                    <p className="mt-1 font-display text-lg leading-snug">{event.title}</p>
                  </Link>
                );
              })}
            </Carousel>
          </Reveal>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-noir text-cream py-20 grain-overlay">
          <Reveal className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading eyebrow="Ils nous ont fait confiance" title="La parole aux clients" dark align="center" className="mx-auto" />
            <div className="mt-12">
              {testimonials.length > 3 ? (
                <Carousel itemClassName="w-[300px] sm:w-[340px]">
                  {testimonials.map((t) => (
                    <TestimonialCard key={t.id} t={t} />
                  ))}
                </Carousel>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <TestimonialCard key={t.id} t={t} />
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="h-full bg-cream text-ink border border-brass/20 rounded-sm p-6 shadow-lg shadow-black/10">
      <blockquote className="font-display text-lg leading-snug text-ink">
        « {t.quote} »
      </blockquote>
      <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-ember">
        {t.author}{t.context ? ` — ${t.context}` : ""}
      </figcaption>
    </figure>
  );
}
