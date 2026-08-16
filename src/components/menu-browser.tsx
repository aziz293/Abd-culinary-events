"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuItemCard } from "@/components/menu-item-card";
import { menuCategories } from "@/lib/data";
import type { MenuCategory, MenuItem } from "@/lib/content-store";

export function MenuBrowser({ items: menuItems }: { items: MenuItem[] }) {
  const [active, setActive] = useState<MenuCategory | "tous">("tous");

  const filtered =
    active === "tous" ? menuItems : menuItems.filter((item) => item.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filtrer le menu par catégorie">
        <button
          role="tab"
          aria-selected={active === "tous"}
          onClick={() => setActive("tous")}
          className={cn(
            "px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
            active === "tous"
              ? "bg-ember text-ink border-ember"
              : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
          )}
        >
          Tout
        </button>
        {menuCategories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={active === cat.id}
            onClick={() => setActive(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
              active === cat.id
                ? "bg-ember text-ink border-ember"
                : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
