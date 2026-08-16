-- ============================================================
-- ABD Culinary Events — schéma Supabase
-- À coller dans Supabase → SQL Editor → New query → Run
-- Peut être exécuté une seule fois (les tables sont recréées si
-- elles existent déjà, donc relancer ce script réinitialise les données).
-- ============================================================

-- Nettoyage (au cas où ce script a déjà été lancé une fois)
drop table if exists menu_items;
drop table if exists gallery_items;
drop table if exists event_offers;
drop table if exists testimonials;
drop table if exists site_settings;

-- ------------------------------------------------------------
-- MENU
-- ------------------------------------------------------------
create table menu_items (
  id text primary key,
  title text not null,
  description text not null default '',
  price integer not null default 0,
  category text not null,
  is_chef_selection boolean not null default false,
  is_vegetarian boolean not null default false,
  spice_level integer not null default 0,
  image_url text not null default ''
);

insert into menu_items (id, title, description, price, category, is_chef_selection, is_vegetarian, spice_level) values
('e1', 'Pastels de crevettes, sauce tamarin', 'Beignets croustillants farcis aux crevettes, oignons et persil, sauce tamarin acidulée.', 3500, 'resto', true, false, 1),
('e2', 'Salade de gésiers confits', 'Gésiers confits, mesclun, tomates cerises, vinaigrette à la moutarde de Dakar.', 4000, 'resto', false, false, 0),
('e3', 'Accras de légumes du marché Kermel', 'Beignets de légumes de saison, coulis de piment doux.', 3000, 'resto', false, true, 1),
('p1', 'Thiéboudieune rouge signature', 'Riz brisé au poisson, légumes mijotés, sauce tomate et niébé, cuisson longue à l''ancienne.', 7500, 'plats', true, false, 2),
('p2', 'Yassa poulet grillé', 'Poulet mariné au citron et à l''oignon confit, riz blanc parfumé.', 6500, 'plats', false, false, 1),
('p3', 'Mafé d''agneau braisé', 'Agneau mijoté à la pâte d''arachide, patates douces, riz cassé.', 8000, 'plats', false, false, 1),
('p4', 'Légumes braisés et fonio doré', 'Fonio sauté aux légumes racines, huile de palme infusée au thym.', 6000, 'resto', false, true, 0),
('d1', 'Thiakry glacé à la vanille', 'Couscous de mil au lait caillé, vanille de Madagascar, éclats de cacahuète.', 2500, 'desserts', false, false, 0),
('d2', 'Tarte au bissap et agrumes', 'Pâte sablée, crémeux bissap, zestes d''agrumes confits.', 3000, 'desserts', true, false, 0),
('pa1', 'Pièce montée sur-mesure', 'Structure et parfums composés avec vous, pour mariages et grandes occasions.', 0, 'patisseries', false, false, 0),
('pa2', 'Coffret mignardises signature', 'Assortiment de douze mignardises, coco, bissap, café touba, caramel au sel.', 15000, 'patisseries', false, false, 0),
('b1', 'Bissap de la maison', 'Infusion d''hibiscus, gingembre frais, sirop léger.', 1500, 'boissons-specialites', false, false, 0),
('b2', 'Café Touba glacé', 'Café Touba infusé à froid, notes de poivre de Guinée.', 1800, 'boissons-specialites', false, false, 0);

-- ------------------------------------------------------------
-- GALERIE
-- ------------------------------------------------------------
create table gallery_items (
  id text primary key,
  category text not null,
  title text not null,
  images jsonb not null default '[]'::jsonb,
  video_url text not null default ''
);

insert into gallery_items (id, category, title) values
('g1', 'Mariages', 'Mariage Fall — Villa Ngor, 400 invités'),
('g2', 'Buffets', 'Buffet thiéboudieune, réception privée Almadies'),
('g3', 'Pâtisserie', 'Pièce montée trois étages, bissap et vanille'),
('g4', 'Événements d''entreprise', 'Petit-déjeuner d''affaires, siège Sonatel'),
('g5', 'Mariages', 'Cocktail de mariage, Terrou-Bi'),
('g6', 'Pâtisserie', 'Coffret mignardises, cent pièces'),
('g7', 'Buffets', 'Buffet mafé et fonio, séminaire Diamniadio'),
('g8', 'Événements d''entreprise', 'Cocktail de lancement produit, Plateau');

-- ------------------------------------------------------------
-- OFFRES DE LA PAGE D'ACCUEIL (4 cartes fixes)
-- ------------------------------------------------------------
create table event_offers (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  image_url text not null default ''
);

insert into event_offers (id, title, description, icon) values
('mariage', 'Mariages', 'Buffets et service à table pour cent à mille invités, pièce montée incluse.', 'heart'),
('entreprise', 'Événements d''entreprise', 'Cocktails, séminaires et petits-déjeuners d''affaires, service ponctuel et discret.', 'briefcase'),
('anniversaire', 'Anniversaires & réceptions privées', 'Menus personnalisés et pâtisserie sur-mesure pour vos occasions privées.', 'cake'),
('patisserie', 'Pâtisserie sur-mesure', 'Pièces montées, gâteaux d''occasion et mignardises composés avec le chef.', 'coffee');

-- ------------------------------------------------------------
-- AVIS CLIENTS
-- ------------------------------------------------------------
create table testimonials (
  id text primary key,
  quote text not null,
  author text not null,
  context text not null default ''
);

insert into testimonials (id, quote, author, context) values
('t1', 'Le buffet a tenu ses promesses du premier au dernier plat, et nos deux cents invités en parlent encore.', 'Aïda D.', 'Mariage, Saly'),
('t2', 'Service ponctuel et discret pour notre séminaire, exactement ce qu''il fallait pour une équipe pressée.', 'Cheikh N.', 'Directeur des opérations, Dakar'),
('t3', 'La pièce montée a tenu toute la soirée et le goût était à la hauteur du visuel.', 'Fatou S.', 'Anniversaire, Ngor');

-- ------------------------------------------------------------
-- PARAMÈTRES DU SITE (une seule ligne)
-- ------------------------------------------------------------
create table site_settings (
  id integer primary key default 1,
  hero_image_url text not null default '',
  concept_image_1_url text not null default '',
  concept_image_2_url text not null default '',
  restaurant_banner_url text not null default '',
  restaurant_chef_image_url text not null default '',
  restaurant_strengths_image_url text not null default '',
  menu_banner_url text not null default '',
  reservation_banner_url text not null default '',
  traiteur_banner_url text not null default '',
  devis_banner_url text not null default '',
  galerie_banner_url text not null default '',
  whatsapp_number text not null default '',
  dish_of_the_day_id text not null default '',
  evening_dish_id text not null default '',
  constraint single_row check (id = 1)
);

insert into site_settings (id, whatsapp_number, dish_of_the_day_id, evening_dish_id) values
(1, '221778897668', 'p1', 'p2');

-- ------------------------------------------------------------
-- SÉCURITÉ : active RLS (Row Level Security) sur toutes les tables,
-- sans aucune règle d'accès public. Le site n'accède à ces tables
-- que via la clé "service role" (SUPABASE_SERVICE_ROLE_KEY), qui
-- contourne RLS et n'est utilisée que côté serveur, jamais exposée
-- au navigateur. Résultat : personne ne peut lire ou écrire ces
-- tables directement depuis l'extérieur.
-- ------------------------------------------------------------
alter table menu_items enable row level security;
alter table gallery_items enable row level security;
alter table event_offers enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;
