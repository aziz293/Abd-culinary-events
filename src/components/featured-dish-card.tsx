"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { MenuItem } from "@/lib/content-store";
import { useCart } from "@/lib/cart-context";

export function FeaturedDishCard({
  item,
  badgeLabel,
  badgeClassName = "bg-ember text-ink",
}: {
  item: MenuItem;
  badgeLabel: string;
  badgeClassName?: string;
}) {
  const { addItem, flyToCart } = useCart();
  const router = useRouter();

  function commander(e: React.MouseEvent<HTMLButtonElement>) {
    addItem({ id: item.id, title: item.title, price: item.price });
    flyToCart(e.currentTarget, item.imageUrl);
  }

  function commanderMaintenant() {
    addItem({ id: item.id, title: item.title, price: item.price });
    router.push("/commander");
  }

  return (
    <div className="relative bg-noir text-cream rounded-[2rem] overflow-hidden shadow-xl shadow-black/20 border border-brass/15 grid md:grid-cols-2 md:min-h-[520px]">
      <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ember/30 via-brass/25 to-noir/10" />
        )}
      </div>

      <div className="relative px-8 sm:px-12 py-12 sm:py-16 flex flex-col justify-center">
        <span className={`inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 ${badgeClassName}`}>
          {badgeLabel}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight">{item.title}</h2>
        <p className="mt-4 text-base text-cream/80 leading-relaxed max-w-md line-clamp-4">{item.description}</p>
        {item.price > 0 && (
          <p className="mt-6 font-mono text-2xl text-brass-bright">
            {item.price.toLocaleString("fr-FR")} F
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={commanderMaintenant}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-ember hover:bg-ember-bright text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Commander <ArrowRight size={14} />
          </button>
          <button
            onClick={commander}
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-brass/50 hover:border-brass-bright hover:text-brass-bright rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
