"use client";

import { Leaf, Plus, Star } from "lucide-react";
import type { MenuItem } from "@/lib/content-store";
import { useCart } from "@/lib/cart-context";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem, flyToCart } = useCart();

  return (
    <div className="relative bg-cream border border-ink/10 rounded-sm overflow-hidden pb-6 ticket-edge-bottom shadow-[0_1px_0_rgba(0,0,0,0.05)]">
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageUrl} alt={item.title} className="w-full aspect-[4/3] object-cover" />
      )}
      <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg leading-snug text-ink">{item.title}</h3>
        {item.price > 0 && (
          <span className="shrink-0 font-mono text-sm text-ember tabular-nums">
            {item.price.toLocaleString("fr-FR")} F
          </span>
        )}
      </div>
      <p className="mt-2 text-base text-ink/85 leading-relaxed">{item.description}</p>

      {(item.isChefSelection || item.isVegetarian || (item.spiceLevel ?? 0) > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.isChefSelection && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-brass/15 text-brass border border-brass/30 rounded-full">
              <Star size={10} /> Suggestion du chef
            </span>
          )}
          {item.isVegetarian && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-herb/15 text-herb border border-herb/30 rounded-full">
              <Leaf size={10} /> Végétarien
            </span>
          )}
          {(item.spiceLevel ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-ember/10 text-ember border border-ember/30 rounded-full">
              {Array.from({ length: item.spiceLevel ?? 0 }).map((_, i) => (
                <span key={i} aria-hidden="true">🌶️</span>
              ))}
            </span>
          )}
        </div>
      )}

      {item.price > 0 && (
        <button
          onClick={(e) => {
            addItem({ id: item.id, title: item.title, price: item.price });
            flyToCart(e.currentTarget, item.imageUrl);
          }}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 font-mono text-xs uppercase tracking-widest px-4 py-2.5 bg-ember hover:bg-ember-bright text-ink rounded-full shadow-sm transition-colors"
        >
          <Plus size={13} /> Ajouter au panier
        </button>
      )}
      </div>
    </div>
  );
}
