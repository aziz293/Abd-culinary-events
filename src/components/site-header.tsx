"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const MAIN_NAV = [
  { label: "Restaurant", href: "/restaurant" },
  { label: "Menu", href: "/menu" },
  { label: "Traiteur", href: "/traiteur" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, open: openCart } = useCart();

  return (
    <header className="sticky top-3 lg:top-4 z-50 px-3 lg:px-6 [overflow-anchor:none]">
      <div className="relative w-full">
        <div className="bg-noir/95 backdrop-blur-md text-cream rounded-full px-5 lg:px-10 py-3 lg:py-4 shadow-xl shadow-black/25 border border-brass/20">
          <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* GAUCHE : nav desktop / hamburger mobile */}
            <div className="flex items-center justify-self-start">
              <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                {MAIN_NAV.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group relative font-mono text-sm lg:text-base uppercase tracking-widest text-cream/85 hover:text-brass-bright transition-colors"
                  >
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-[1.5px] w-full bg-brass-bright scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="lg:hidden relative w-8 h-8 flex items-center justify-center"
                aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <span
                  className={cn(
                    "absolute block w-5 h-[1.5px] bg-cream transition-all duration-300",
                    isMobileMenuOpen ? "rotate-45" : "-translate-y-[5px]"
                  )}
                />
                <span
                  className={cn(
                    "absolute block w-5 h-[1.5px] bg-cream transition-all duration-300",
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute block w-5 h-[1.5px] bg-cream transition-all duration-300",
                    isMobileMenuOpen ? "-rotate-45" : "translate-y-[5px]"
                  )}
                />
              </button>
            </div>

            {/* CENTRE : espace réservé au logo (le logo est positionné en absolu pour déborder du bandeau) */}
            <div className="justify-self-center w-16 lg:w-20" aria-hidden="true" />

            {/* DROITE : actions / téléphone mobile */}
            <div className="flex items-center justify-self-end gap-1 lg:gap-3">
              <button
                id="cart-icon-target"
                onClick={openCart}
                className="relative w-8 h-8 flex items-center justify-center rounded-full text-cream/80 hover:text-brass-bright hover:bg-cream/5 transition-colors"
                aria-label="Voir le panier"
              >
                <motion.div
                  animate={
                    totalItems > 0
                      ? { scale: [1, 1.18, 1, 1.18, 1], rotate: [0, -8, 8, -4, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={
                    totalItems > 0
                      ? { duration: 1.1, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }
                      : { duration: 0.2 }
                  }
                >
                  <ShoppingBag size={18} />
                </motion.div>
                {totalItems > 0 && (
                  <motion.span
                    key={`badge-${totalItems}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ember text-ink text-[10px] font-mono flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <a
                href="tel:+221778897668"
                className="w-8 h-8 flex items-center justify-center rounded-full text-cream/80 hover:text-brass-bright hover:bg-cream/5 transition-colors"
                aria-label="Appeler ABD Culinary Events"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>

              <Link
                href="/menu"
                className="hidden lg:inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-widest px-5 py-2.5 border border-brass/50 rounded-full hover:border-brass-bright hover:text-brass-bright transition-colors"
              >
                Commander
              </Link>
              <Link
                href="/reservation"
                className="hidden lg:inline-flex font-mono text-sm uppercase tracking-widest px-5 py-2.5 bg-ember hover:bg-ember-bright rounded-full text-ink transition-colors"
              >
                Réserver
              </Link>
            </div>
          </div>
        </div>

        {/* LOGO : cadre circulaire vert, positionné en absolu pour déborder verticalement du bandeau */}
        <Link
          href="/"
          className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="ABD Culinary Events — accueil"
        >
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-brass p-1 lg:p-1.5 shadow-xl shadow-black/35 border-2 border-cream/15 transition-transform duration-700 ease-out group-hover:rotate-[360deg]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/abd-logo-light.png"
              alt=""
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
        </Link>

        {/* TIROIR MOBILE */}
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 mt-2 overflow-hidden transition-all duration-300 ease-out origin-top",
            isMobileMenuOpen ? "opacity-100 scale-y-100 max-h-96" : "opacity-0 scale-y-95 max-h-0 pointer-events-none"
          )}
        >
          <nav className="bg-noir text-cream rounded-3xl shadow-xl border border-brass/20 p-6 flex flex-col gap-4">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-mono uppercase text-sm tracking-widest hover:text-brass-bright py-1"
              >
                {item.label}
              </Link>
            ))}

            <hr className="border-brass/15 my-1" />

            <a
              href="tel:+221778897668"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm opacity-80 hover:opacity-100 hover:text-brass-bright py-1"
            >
              +221 77 000 00 00
            </a>

            <div className="flex flex-col gap-2 mt-1">
              <Link
                href="/menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 border border-brass/50 rounded-full font-mono text-xs uppercase tracking-widest"
              >
                Commander
              </Link>
              <Link
                href="/devis"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 border border-brass/50 rounded-full font-mono text-xs uppercase tracking-widest"
              >
                Devis traiteur
              </Link>
              <Link
                href="/reservation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 bg-ember text-ink rounded-full font-mono text-xs uppercase tracking-widest"
              >
                Réserver une table
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
