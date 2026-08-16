import { getSupabase } from "@/lib/supabase";

// ============================================================
// Ce fichier est la SEULE partie du site qui parle à la base de
// données. Toutes les pages et routes API passent par les fonctions
// ci-dessous (getMenuItems, addMenuItem, etc.) — elles n'ont pas
// besoin de savoir que ça vient de Supabase plutôt que de fichiers
// JSON. C'est ce qui permet de changer de stockage sans toucher au
// reste du site.
// ============================================================

export type MenuCategory =
  | "burgers"
  | "sandwichs"
  | "chawarmas"
  | "tacos"
  | "desserts"
  | "patisseries"
  | "resto"
  | "boissons-specialites"
  | "plats";

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: MenuCategory;
  isChefSelection?: boolean;
  isVegetarian?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
  imageUrl?: string;
}

interface MenuItemRow {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  is_chef_selection: boolean;
  is_vegetarian: boolean;
  spice_level: number;
  image_url: string;
}

function fromMenuRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: row.category as MenuCategory,
    isChefSelection: row.is_chef_selection,
    isVegetarian: row.is_vegetarian,
    spiceLevel: row.spice_level as 0 | 1 | 2 | 3,
    imageUrl: row.image_url,
  };
}

function toMenuRow(item: Partial<MenuItem>) {
  const row: Record<string, unknown> = {};
  if (item.title !== undefined) row.title = item.title;
  if (item.description !== undefined) row.description = item.description;
  if (item.price !== undefined) row.price = item.price;
  if (item.category !== undefined) row.category = item.category;
  if (item.isChefSelection !== undefined) row.is_chef_selection = item.isChefSelection;
  if (item.isVegetarian !== undefined) row.is_vegetarian = item.isVegetarian;
  if (item.spiceLevel !== undefined) row.spice_level = item.spiceLevel;
  if (item.imageUrl !== undefined) row.image_url = item.imageUrl;
  return row;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await getSupabase().from("menu_items").select("*").order("id");
  if (error) throw error;
  return (data as MenuItemRow[]).map(fromMenuRow);
}

export async function addMenuItem(item: Omit<MenuItem, "id">): Promise<MenuItem> {
  const id = makeId("m");
  const { data, error } = await getSupabase()
    .from("menu_items")
    .insert({ id, ...toMenuRow(item) })
    .select()
    .single();
  if (error) throw error;
  return fromMenuRow(data as MenuItemRow);
}

export async function updateMenuItem(id: string, patch: Partial<MenuItem>): Promise<MenuItem | null> {
  const { data, error } = await getSupabase()
    .from("menu_items")
    .update(toMenuRow(patch))
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? fromMenuRow(data as MenuItemRow) : null;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await getSupabase().from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export interface GalleryItem {
  id: string;
  category: "Buffets" | "Pâtisserie" | "Mariages" | "Événements d'entreprise";
  title: string;
  images: string[];
  videoUrl?: string;
}

interface GalleryItemRow {
  id: string;
  category: string;
  title: string;
  images: string[];
  video_url: string;
}

function fromGalleryRow(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    category: row.category as GalleryItem["category"],
    title: row.title,
    images: row.images ?? [],
    videoUrl: row.video_url,
  };
}

function toGalleryRow(item: Partial<GalleryItem>) {
  const row: Record<string, unknown> = {};
  if (item.category !== undefined) row.category = item.category;
  if (item.title !== undefined) row.title = item.title;
  if (item.images !== undefined) row.images = item.images;
  if (item.videoUrl !== undefined) row.video_url = item.videoUrl;
  return row;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await getSupabase().from("gallery_items").select("*").order("id");
  if (error) throw error;
  return (data as GalleryItemRow[]).map(fromGalleryRow);
}

export async function addGalleryItem(item: Omit<GalleryItem, "id">): Promise<GalleryItem> {
  const id = makeId("g");
  const { data, error } = await getSupabase()
    .from("gallery_items")
    .insert({ id, ...toGalleryRow(item) })
    .select()
    .single();
  if (error) throw error;
  return fromGalleryRow(data as GalleryItemRow);
}

export async function updateGalleryItem(id: string, patch: Partial<GalleryItem>): Promise<GalleryItem | null> {
  const { data, error } = await getSupabase()
    .from("gallery_items")
    .update(toGalleryRow(patch))
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? fromGalleryRow(data as GalleryItemRow) : null;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { error } = await getSupabase().from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}

export interface EventOffer {
  id: "mariage" | "entreprise" | "anniversaire" | "patisserie";
  title: string;
  description: string;
  icon: "heart" | "briefcase" | "cake" | "coffee";
  imageUrl?: string;
}

interface EventOfferRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string;
}

function fromOfferRow(row: EventOfferRow): EventOffer {
  return {
    id: row.id as EventOffer["id"],
    title: row.title,
    description: row.description,
    icon: row.icon as EventOffer["icon"],
    imageUrl: row.image_url,
  };
}

export async function getEventOffers(): Promise<EventOffer[]> {
  const { data, error } = await getSupabase().from("event_offers").select("*").order("id");
  if (error) throw error;
  return (data as EventOfferRow[]).map(fromOfferRow);
}

export async function updateEventOffer(id: string, patch: Partial<EventOffer>): Promise<EventOffer | null> {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.imageUrl !== undefined) row.image_url = patch.imageUrl;
  const { data, error } = await getSupabase()
    .from("event_offers")
    .update(row)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? fromOfferRow(data as EventOfferRow) : null;
}

export interface SiteSettings {
  heroImageUrl?: string;
  conceptImage1Url?: string;
  conceptImage2Url?: string;
  restaurantBannerUrl?: string;
  restaurantChefImageUrl?: string;
  restaurantStrengthsImageUrl?: string;
  menuBannerUrl?: string;
  reservationBannerUrl?: string;
  traiteurBannerUrl?: string;
  devisBannerUrl?: string;
  galerieBannerUrl?: string;
  whatsappNumber?: string;
  dishOfTheDayId?: string;
  eveningDishId?: string;
}

interface SiteSettingsRow {
  hero_image_url: string;
  concept_image_1_url: string;
  concept_image_2_url: string;
  restaurant_banner_url: string;
  restaurant_chef_image_url: string;
  restaurant_strengths_image_url: string;
  menu_banner_url: string;
  reservation_banner_url: string;
  traiteur_banner_url: string;
  devis_banner_url: string;
  galerie_banner_url: string;
  whatsapp_number: string;
  dish_of_the_day_id: string;
  evening_dish_id: string;
}

function fromSettingsRow(row: SiteSettingsRow): SiteSettings {
  return {
    heroImageUrl: row.hero_image_url,
    conceptImage1Url: row.concept_image_1_url,
    conceptImage2Url: row.concept_image_2_url,
    restaurantBannerUrl: row.restaurant_banner_url,
    restaurantChefImageUrl: row.restaurant_chef_image_url,
    restaurantStrengthsImageUrl: row.restaurant_strengths_image_url,
    menuBannerUrl: row.menu_banner_url,
    reservationBannerUrl: row.reservation_banner_url,
    traiteurBannerUrl: row.traiteur_banner_url,
    devisBannerUrl: row.devis_banner_url,
    galerieBannerUrl: row.galerie_banner_url,
    whatsappNumber: row.whatsapp_number,
    dishOfTheDayId: row.dish_of_the_day_id,
    eveningDishId: row.evening_dish_id,
  };
}

function toSettingsRow(patch: Partial<SiteSettings>) {
  const row: Record<string, unknown> = {};
  if (patch.heroImageUrl !== undefined) row.hero_image_url = patch.heroImageUrl;
  if (patch.conceptImage1Url !== undefined) row.concept_image_1_url = patch.conceptImage1Url;
  if (patch.conceptImage2Url !== undefined) row.concept_image_2_url = patch.conceptImage2Url;
  if (patch.restaurantBannerUrl !== undefined) row.restaurant_banner_url = patch.restaurantBannerUrl;
  if (patch.restaurantChefImageUrl !== undefined) row.restaurant_chef_image_url = patch.restaurantChefImageUrl;
  if (patch.restaurantStrengthsImageUrl !== undefined) row.restaurant_strengths_image_url = patch.restaurantStrengthsImageUrl;
  if (patch.menuBannerUrl !== undefined) row.menu_banner_url = patch.menuBannerUrl;
  if (patch.reservationBannerUrl !== undefined) row.reservation_banner_url = patch.reservationBannerUrl;
  if (patch.traiteurBannerUrl !== undefined) row.traiteur_banner_url = patch.traiteurBannerUrl;
  if (patch.devisBannerUrl !== undefined) row.devis_banner_url = patch.devisBannerUrl;
  if (patch.galerieBannerUrl !== undefined) row.galerie_banner_url = patch.galerieBannerUrl;
  if (patch.whatsappNumber !== undefined) row.whatsapp_number = patch.whatsappNumber;
  if (patch.dishOfTheDayId !== undefined) row.dish_of_the_day_id = patch.dishOfTheDayId;
  if (patch.eveningDishId !== undefined) row.evening_dish_id = patch.eveningDishId;
  return row;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabase().from("site_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return fromSettingsRow(data as SiteSettingsRow);
}

export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data, error } = await getSupabase()
    .from("site_settings")
    .update(toSettingsRow(patch))
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return fromSettingsRow(data as SiteSettingsRow);
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  context: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await getSupabase().from("testimonials").select("*").order("id");
  if (error) throw error;
  return data as Testimonial[];
}

export async function addTestimonial(item: Omit<Testimonial, "id">): Promise<Testimonial> {
  const id = makeId("t");
  const { data, error } = await getSupabase()
    .from("testimonials")
    .insert({ id, ...item })
    .select()
    .single();
  if (error) throw error;
  return data as Testimonial;
}

export async function updateTestimonial(id: string, patch: Partial<Testimonial>): Promise<Testimonial | null> {
  const { data, error } = await getSupabase()
    .from("testimonials")
    .update(patch)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as Testimonial | null;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await getSupabase().from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
