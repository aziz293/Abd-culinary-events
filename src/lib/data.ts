import type { MenuCategory } from "@/lib/content-store";

export const menuCategories: { id: MenuCategory; label: string }[] = [
  { id: "burgers", label: "Burgers" },
  { id: "sandwichs", label: "Sandwichs" },
  { id: "chawarmas", label: "Chawarmas" },
  { id: "tacos", label: "Tacos" },
  { id: "resto", label: "Resto" },
  { id: "desserts", label: "Desserts" },
  { id: "patisseries", label: "Pâtisseries" },
  { id: "boissons-specialites", label: "Boissons & Spécialités" },
];

// Réservée à l'admin : les plats de cette catégorie n'apparaissent jamais sur la page Menu
// publique. C'est le vivier dans lequel on choisit le plat du jour et les plats du soir.
export const adminMenuCategories: { id: MenuCategory; label: string }[] = [
  ...menuCategories,
  { id: "plats", label: "Plats (jour & soir uniquement)" },
];

export const eventTypeOptions = [
  "Mariage",
  "Cocktail d'entreprise",
  "Anniversaire",
  "Petit-déjeuner d'affaires",
  "Buffet privé",
  "Autre",
];

export const serviceOptions = [
  "Pâtisserie sur-mesure",
  "Buffet chaud",
  "Buffet froid",
  "Service en salle",
  "Décoration & arts de la table",
  "Boissons & cocktails sans alcool",
];

export const budgetRanges = [
  "Moins de 500 000 FCFA",
  "500 000 - 1 500 000 FCFA",
  "1 500 000 - 5 000 000 FCFA",
  "Plus de 5 000 000 FCFA",
  "Je ne sais pas encore",
];

export const galleryCategories = ["Buffets", "Pâtisserie", "Mariages", "Événements d'entreprise"] as const;
