"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const { items, setQty, removeItem, totalPrice, isOpen, close } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-noir/70" onClick={close} />
      <div className="relative w-full max-w-sm h-full bg-cream text-ink shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-ember" />
            <h2 className="font-display text-lg">Votre panier</h2>
          </div>
          <button onClick={close} aria-label="Fermer le panier" className="text-ink/50 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <p className="text-ink/50 text-sm mt-6 text-center">
              Votre panier est vide. Ajoutez des plats depuis le menu.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-ink/50 font-mono mt-0.5">
                      {item.price.toLocaleString("fr-FR")} F
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label="Diminuer la quantité"
                        className="w-6 h-6 flex items-center justify-center rounded-full border border-ink/20 hover:border-ember hover:text-ember"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-sm font-mono">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label="Augmenter la quantité"
                        className="w-6 h-6 flex items-center justify-center rounded-full border border-ink/20 hover:border-ember hover:text-ember"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm">{(item.price * item.qty).toLocaleString("fr-FR")} F</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Retirer du panier"
                      className="mt-2 text-ink/40 hover:text-ember"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-ink/10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink/60">Total</span>
              <span className="font-display text-xl">{totalPrice.toLocaleString("fr-FR")} F</span>
            </div>
            <Link
              href="/commander"
              onClick={close}
              className="block text-center px-6 py-3 bg-ember hover:bg-ember-bright text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
            >
              Passer la commande
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
