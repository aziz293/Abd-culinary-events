"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploadField } from "@/components/image-upload-field";
import { MultiImageUploadField } from "@/components/multi-image-upload-field";
import type { MenuCategory, MenuItem, GalleryItem, EventOffer, SiteSettings, Testimonial } from "@/lib/content-store";
import { adminMenuCategories, galleryCategories } from "@/lib/data";

export function AdminDashboard({
  initialMenu,
  initialGallery,
  initialOffers,
  initialSettings,
  initialTestimonials,
}: {
  initialMenu: MenuItem[];
  initialGallery: GalleryItem[];
  initialOffers: EventOffer[];
  initialSettings: SiteSettings;
  initialTestimonials: Testimonial[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"menu" | "galerie" | "avis" | "images">("menu");
  const [menu, setMenu] = useState(initialMenu);
  const [gallery, setGallery] = useState(initialGallery);
  const [offers, setOffers] = useState(initialOffers);
  const [settings, setSettings] = useState(initialSettings);
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream-dim">
      <div className="bg-noir text-cream py-8">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-brass-bright">Administration</p>
            <h1 className="font-display text-2xl mt-1">Contenu du site</h1>
          </div>
          <button
            onClick={logout}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-brass/40 rounded-full hover:border-brass-bright hover:text-brass-bright transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {(["menu", "galerie", "avis", "images"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
                tab === t ? "bg-ember text-ink border-ember" : "border-ink/15 text-ink/60 hover:border-ember"
              )}
            >
              {t === "menu" ? "Menu du restaurant" : t === "galerie" ? "Galerie" : t === "avis" ? "Avis clients" : "Images du site"}
            </button>
          ))}
        </div>

        {tab === "menu" ? (
          <MenuAdmin
            items={menu}
            setItems={setMenu}
            dishOfTheDayId={settings.dishOfTheDayId ?? ""}
            eveningDishId={settings.eveningDishId ?? ""}
            setSettings={setSettings}
          />
        ) : tab === "galerie" ? (
          <GalleryAdmin items={gallery} setItems={setGallery} />
        ) : tab === "avis" ? (
          <TestimonialsAdmin items={testimonials} setItems={setTestimonials} />
        ) : (
          <SiteImagesAdmin
            offers={offers}
            setOffers={setOffers}
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------- MENU ---------------------------- */

const emptyMenuForm = {
  title: "",
  description: "",
  price: 0,
  category: "resto" as MenuCategory,
  isChefSelection: false,
  spiceLevel: 0 as 0 | 1 | 2 | 3,
  imageUrl: "",
};

function MenuAdmin({
  items,
  setItems,
  dishOfTheDayId,
  eveningDishId,
  setSettings,
}: {
  items: MenuItem[];
  setItems: (fn: (prev: MenuItem[]) => MenuItem[]) => void;
  dishOfTheDayId: string;
  eveningDishId: string;
  setSettings: (fn: (prev: SiteSettings) => SiteSettings) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyMenuForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savingDish, setSavingDish] = useState(false);
  const [savingEvening, setSavingEvening] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  async function changeDishOfTheDay(id: string) {
    setSavingDish(true);
    setSettings((prev) => ({ ...prev, dishOfTheDayId: id }));
    try {
      await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishOfTheDayId: id }),
      });
    } finally {
      setSavingDish(false);
    }
  }

  async function changeEveningDish(id: string) {
    setSavingEvening(true);
    setSettings((prev) => ({ ...prev, eveningDishId: id }));
    try {
      await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eveningDishId: id }),
      });
    } finally {
      setSavingEvening(false);
    }
  }

  function startCreate() {
    setForm(emptyMenuForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(item: MenuItem) {
    setForm({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      isChefSelection: !!item.isChefSelection,
      spiceLevel: item.spiceLevel ?? 0,
      imageUrl: item.imageUrl ?? "",
    });
    setEditingId(item.id);
    setShowForm(true);
    setError("");
  }

  async function save() {
    if (!form.title.trim()) {
      setError("Le nom du plat est requis.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/menu/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
      } else {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setItems((prev) => [...prev, created]);
      }
      setShowForm(false);
    } catch {
      setError("Une erreur est survenue, réessayez.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce plat ?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const platsPool = items.filter((i) => i.category === "plats");

  return (
    <div>
      <div className="bg-cream border border-ink/10 rounded-sm p-6 mb-6">
        <h3 className="font-display text-lg mb-1">Plat du jour &amp; plats du soir</h3>
        <p className="text-ink/50 text-xs mb-4">
          Ces choix se font uniquement parmi les plats de la catégorie « Plats (jour &amp; soir
          uniquement) » — créez-y un plat d&apos;abord si la liste ci-dessous est vide. Ces plats,
          ainsi que celui du jour et ceux du soir, n&apos;apparaissent jamais sur la page Menu
          publique : seulement sur la page d&apos;accueil.
        </p>

        {platsPool.length === 0 ? (
          <p className="text-ink/40 text-sm italic">
            Aucun plat dans la catégorie « Plats » pour le moment.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Plat du jour
              </span>
              <select
                value={dishOfTheDayId}
                onChange={(e) => changeDishOfTheDay(e.target.value)}
                disabled={savingDish}
                className={fieldClass}
              >
                <option value="">Aucun</option>
                {platsPool.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Plat du soir
              </span>
              <select
                value={eveningDishId}
                onChange={(e) => changeEveningDish(e.target.value)}
                disabled={savingEvening}
                className={fieldClass}
              >
                <option value="">Aucun</option>
                {platsPool.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-5">
        <p className="text-ink/60 text-sm">{items.length} plat(s) au total</p>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-full font-mono text-xs uppercase tracking-widest hover:bg-noir transition-colors"
        >
          <Plus size={14} /> Ajouter un plat
        </button>
      </div>

      {showForm && (
        <div className="bg-cream border border-ink/10 rounded-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-display text-lg">{editingId ? "Modifier le plat" : "Nouveau plat"}</h3>
            <button onClick={() => setShowForm(false)} aria-label="Fermer" className="text-ink/40 hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Nom du plat" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
            <TextField
              label="Prix (FCFA, 0 = sur devis)"
              type="number"
              value={String(form.price)}
              onChange={(v) => setForm((f) => ({ ...f, price: Number(v) || 0 }))}
            />
            <label className="block sm:col-span-2">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Description
              </span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Photo du plat"
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              />
            </div>
            <label className="block">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Catégorie
              </span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as MenuCategory }))}
                className={fieldClass}
              >
                {adminMenuCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Niveau de piment (0 à 3)
              </span>
              <select
                value={form.spiceLevel}
                onChange={(e) => setForm((f) => ({ ...f, spiceLevel: Number(e.target.value) as 0 | 1 | 2 | 3 }))}
                className={fieldClass}
              >
                {[0, 1, 2, 3].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isChefSelection}
                onChange={(e) => setForm((f) => ({ ...f, isChefSelection: e.target.checked }))}
              />
              Suggestion du chef
            </label>
          </div>
          {error && <p className="text-ember text-sm mt-3">{error}</p>}
          <button
            onClick={save}
            disabled={saving}
            className="mt-5 px-6 py-2.5 bg-ember hover:bg-ember-bright disabled:opacity-60 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      )}

      <h3 className="font-display text-lg mb-4">Modifier les plats</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoryFilter("all")}
          className={cn(
            "px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
            categoryFilter === "all" ? "bg-ember text-ink border-ember" : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
          )}
        >
          Tout
        </button>
        {adminMenuCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
              categoryFilter === cat.id ? "bg-ember text-ink border-ember" : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items
          .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
          .map((item) => (
            <AdminDishCard
              key={item.id}
              item={item}
              isDishOfTheDay={item.id === dishOfTheDayId}
              isEveningDish={item.id === eveningDishId}
              onEdit={() => startEdit(item)}
              onDelete={() => remove(item.id)}
            />
          ))}
      </div>
    </div>
  );
}

function AdminDishCard({
  item,
  isDishOfTheDay,
  isEveningDish,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  isDishOfTheDay: boolean;
  isEveningDish: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-cream border border-ink/10 rounded-sm overflow-hidden flex flex-col">
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageUrl} alt={item.title} className="w-full aspect-[4/3] object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <p className="font-medium">{item.title}</p>
        <p className="text-xs text-ink/50 font-mono uppercase tracking-widest mt-1">
          {item.price > 0 ? `${item.price.toLocaleString("fr-FR")} F` : "sur devis"}
        </p>
        {(item.isChefSelection || isDishOfTheDay || isEveningDish) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.isChefSelection && (
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-brass/15 text-brass border border-brass/30 rounded-full">
                Chef
              </span>
            )}
            {isDishOfTheDay && (
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-ember/15 text-ember border border-ember/30 rounded-full">
                Plat du jour
              </span>
            )}
            {isEveningDish && (
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-brass/15 text-brass border border-brass/30 rounded-full">
                Plat du soir
              </span>
            )}
          </div>
        )}
        <div className="mt-auto pt-3 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-ink/15 rounded-full font-mono text-[11px] uppercase tracking-widest hover:border-ember hover:text-ember transition-colors"
          >
            <Pencil size={13} /> Modifier
          </button>
          <button
            onClick={onDelete}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-ink/15 rounded-full font-mono text-[11px] uppercase tracking-widest hover:border-ember hover:text-ember transition-colors"
          >
            <Trash2 size={13} /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- GALERIE ---------------------------- */

const emptyGalleryForm = {
  title: "",
  category: "Buffets" as GalleryItem["category"],
  images: [] as string[],
  videoUrl: "",
};

function GalleryAdmin({
  items,
  setItems,
}: {
  items: GalleryItem[];
  setItems: (fn: (prev: GalleryItem[]) => GalleryItem[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyGalleryForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startCreate() {
    setForm(emptyGalleryForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(item: GalleryItem) {
    setForm({
      title: item.title,
      category: item.category,
      images: item.images ?? [],
      videoUrl: item.videoUrl ?? "",
    });
    setEditingId(item.id);
    setShowForm(true);
    setError("");
  }

  async function save() {
    if (!form.title.trim()) {
      setError("Le titre est requis.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/gallery/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setItems((prev) => [...prev, created]);
      }
      setShowForm(false);
    } catch {
      setError("Une erreur est survenue, réessayez.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet événement de la galerie ?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-ink/60 text-sm">{items.length} événement(s) dans la galerie</p>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-full font-mono text-xs uppercase tracking-widest hover:bg-noir transition-colors"
        >
          <Plus size={14} /> Ajouter un événement
        </button>
      </div>

      {showForm && (
        <div className="bg-cream border border-ink/10 rounded-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-display text-lg">{editingId ? "Modifier l'événement" : "Nouvel événement"}</h3>
            <button onClick={() => setShowForm(false)} aria-label="Fermer" className="text-ink/40 hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Titre / légende" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
            <label className="block">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Catégorie
              </span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as GalleryItem["category"] }))}
                className={fieldClass}
              >
                {galleryCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-2">
              <MultiImageUploadField
                label="Photos de cet événement"
                values={form.images}
                onChange={(images) => setForm((f) => ({ ...f, images }))}
              />
            </div>
            <label className="block sm:col-span-2">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Lien vidéo YouTube (optionnel)
              </span>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                className={fieldClass}
              />
              <span className="block mt-1.5 text-xs text-ink/45">
                Collez le lien de la vidéo YouTube (mise en "non répertoriée" si vous ne voulez pas
                qu&apos;elle apparaisse sur votre chaîne publique).
              </span>
            </label>
          </div>
          {error && <p className="text-ember text-sm mt-3">{error}</p>}
          <button
            onClick={save}
            disabled={saving}
            className="mt-5 px-6 py-2.5 bg-ember hover:bg-ember-bright disabled:opacity-60 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 bg-cream border border-ink/10 rounded-sm px-5 py-3.5"
          >
            <div>
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-ink/50 font-mono uppercase tracking-widest mt-0.5">
                {item.category} · {item.images?.length ?? 0} photo(s){item.videoUrl ? " · vidéo" : ""}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(item)} className="p-2 text-ink/50 hover:text-ember" aria-label="Modifier">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(item.id)} className="p-2 text-ink/50 hover:text-ember" aria-label="Supprimer">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- IMAGES DU SITE ---------------------------- */

const settingsFieldGroups: { title: string; note?: string; fields: { key: keyof SiteSettings; label: string }[] }[] = [
  {
    title: "Page d'accueil",
    fields: [
      { key: "heroImageUrl", label: "Photo du hero (grande photo en haut de la page)" },
      { key: "conceptImage1Url", label: "Photo 1 — section « Le concept »" },
      { key: "conceptImage2Url", label: "Photo 2 — section « Le concept »" },
    ],
  },
  {
    title: "Bannières des autres pages",
    note: "La photo affichée en haut de chaque page.",
    fields: [
      { key: "restaurantBannerUrl", label: "Bannière — Restaurant" },
      { key: "menuBannerUrl", label: "Bannière — Menu" },
      { key: "reservationBannerUrl", label: "Bannière — Réservation" },
      { key: "traiteurBannerUrl", label: "Bannière — Traiteur" },
      { key: "devisBannerUrl", label: "Bannière — Devis" },
      { key: "galerieBannerUrl", label: "Bannière — Galerie" },
    ],
  },
  {
    title: "Page Restaurant",
    fields: [
      { key: "restaurantChefImageUrl", label: "Photo du chef" },
      { key: "restaurantStrengthsImageUrl", label: "Photo — section « c'est avant tout »" },
    ],
  },
];

function SiteImagesAdmin({
  offers,
  setOffers,
  settings,
  setSettings,
}: {
  offers: EventOffer[];
  setOffers: (fn: (prev: EventOffer[]) => EventOffer[]) => void;
  settings: SiteSettings;
  setSettings: (fn: (prev: SiteSettings) => SiteSettings) => void;
}) {
  const [savingOfferId, setSavingOfferId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState("");

  async function saveSettings() {
    setSavingSettings(true);
    setError("");
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError("Une erreur est survenue, réessayez.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveOffer(offer: EventOffer) {
    setSavingOfferId(offer.id);
    setError("");
    try {
      const res = await fetch("/api/home-offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offer),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOffers((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch {
      setError("Une erreur est survenue, réessayez.");
    } finally {
      setSavingOfferId(null);
    }
  }

  function patchOffer(id: string, fields: Partial<EventOffer>) {
    setOffers((prev) => prev.map((i) => (i.id === id ? { ...i, ...fields } : i)));
  }

  return (
    <div>
      <p className="text-ink/60 text-sm mb-5">
        Toutes les photos du site se gèrent ici, sauf les plats et la galerie qui ont leurs propres onglets.
      </p>
      {error && <p className="text-ember text-sm mb-4">{error}</p>}

      <div className="bg-cream border border-ink/10 rounded-sm p-6 mb-6">
        <h3 className="font-display text-lg mb-1">Coordonnées</h3>
        <p className="text-ink/50 text-xs mb-4">
          Le numéro qui reçoit les commandes envoyées via WhatsApp depuis le site (aucun espace, sans le +,
          avec l&apos;indicatif pays — ex. 221770000000 pour le Sénégal).
        </p>
        <TextField
          label="Numéro WhatsApp"
          value={settings.whatsappNumber ?? ""}
          onChange={(v) => setSettings((prev) => ({ ...prev, whatsappNumber: v }))}
        />
      </div>

      {settingsFieldGroups.map((group) => (
        <div key={group.title} className="bg-cream border border-ink/10 rounded-sm p-6 mb-6">
          <h3 className="font-display text-lg mb-1">{group.title}</h3>
          {group.note && <p className="text-ink/50 text-xs mb-4">{group.note}</p>}
          <div className={cn("space-y-6", group.note ? "mt-4" : "mt-4")}>
            {group.fields.map((field) => (
              <ImageUploadField
                key={field.key}
                label={field.label}
                value={settings[field.key] ?? ""}
                onChange={(url) => setSettings((prev) => ({ ...prev, [field.key]: url }))}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={saveSettings}
        disabled={savingSettings}
        className="mb-10 px-6 py-2.5 bg-ember hover:bg-ember-bright disabled:opacity-60 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
      >
        {savingSettings ? "Enregistrement..." : "Enregistrer ces images"}
      </button>

      <div className="bg-cream border border-ink/10 rounded-sm p-6 mb-4">
        <h3 className="font-display text-lg mb-1">Types d&apos;événements</h3>
        <p className="text-ink/50 text-xs">
          Ces quatre cartes apparaissent sur la page d&apos;accueil et sur la page Traiteur.
        </p>
      </div>

      <div className="space-y-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-cream border border-ink/10 rounded-sm p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                label="Titre"
                value={offer.title}
                onChange={(v) => patchOffer(offer.id, { title: v })}
              />
              <label className="block">
                <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                  Description
                </span>
                <input
                  type="text"
                  value={offer.description}
                  onChange={(e) => patchOffer(offer.id, { description: e.target.value })}
                  className={fieldClass}
                />
              </label>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Photo"
                  value={offer.imageUrl ?? ""}
                  onChange={(url) => patchOffer(offer.id, { imageUrl: url })}
                />
              </div>
            </div>
            <button
              onClick={() => saveOffer(offer)}
              disabled={savingOfferId === offer.id}
              className="mt-5 px-6 py-2.5 bg-ember hover:bg-ember-bright disabled:opacity-60 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
            >
              {savingOfferId === offer.id ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- AVIS CLIENTS ---------------------------- */

const emptyTestimonialForm = { quote: "", author: "", context: "" };

function TestimonialsAdmin({
  items,
  setItems,
}: {
  items: Testimonial[];
  setItems: (fn: (prev: Testimonial[]) => Testimonial[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTestimonialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startCreate() {
    setForm(emptyTestimonialForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(item: Testimonial) {
    setForm({ quote: item.quote, author: item.author, context: item.context });
    setEditingId(item.id);
    setShowForm(true);
    setError("");
  }

  async function save() {
    if (!form.quote.trim() || !form.author.trim()) {
      setError("L'avis et le nom du client sont requis.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/testimonials/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
      } else {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setItems((prev) => [...prev, created]);
      }
      setShowForm(false);
    } catch {
      setError("Une erreur est survenue, réessayez.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet avis ?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <p className="text-ink/60 text-sm mb-5">
        Ces avis apparaissent sur la page d&apos;accueil. Au-delà de 3, ils défilent automatiquement
        en carrousel. Copiez-collez le texte de vos vrais avis Google ici pour qu&apos;ils
        remplacent les exemples de démonstration.
      </p>

      <div className="flex justify-between items-center mb-5">
        <p className="text-ink/60 text-sm">{items.length} avis</p>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-full font-mono text-xs uppercase tracking-widest hover:bg-noir transition-colors"
        >
          <Plus size={14} /> Ajouter un avis
        </button>
      </div>

      {showForm && (
        <div className="bg-cream border border-ink/10 rounded-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-display text-lg">{editingId ? "Modifier l'avis" : "Nouvel avis"}</h3>
            <button onClick={() => setShowForm(false)} aria-label="Fermer" className="text-ink/40 hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4">
            <label className="block">
              <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
                Texte de l&apos;avis
              </span>
              <textarea
                rows={3}
                value={form.quote}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Nom du client" value={form.author} onChange={(v) => setForm((f) => ({ ...f, author: v }))} />
              <TextField
                label="Contexte (optionnel)"
                value={form.context}
                onChange={(v) => setForm((f) => ({ ...f, context: v }))}
              />
            </div>
          </div>
          {error && <p className="text-ember text-sm mt-3">{error}</p>}
          <button
            onClick={save}
            disabled={saving}
            className="mt-5 px-6 py-2.5 bg-ember hover:bg-ember-bright disabled:opacity-60 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 bg-cream border border-ink/10 rounded-sm px-5 py-3.5"
          >
            <div>
              <p className="text-sm italic">« {item.quote} »</p>
              <p className="text-xs text-ink/50 font-mono uppercase tracking-widest mt-1">
                {item.author}{item.context ? ` — ${item.context}` : ""}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(item)} className="p-2 text-ink/50 hover:text-ember" aria-label="Modifier">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(item.id)} className="p-2 text-ink/50 hover:text-ember" aria-label="Supprimer">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- shared ---------------------------- */

const fieldClass =
  "w-full bg-cream border border-ink/15 rounded-sm px-4 py-2.5 text-sm focus:border-ember outline-none transition-colors";

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass} />
    </label>
  );
}
