import type { Metadata } from "next";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500-italic.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { FlyToCartLayer } from "@/components/fly-to-cart-layer";
import { PageTransition } from "@/components/page-transition";
import { ScrollToTop } from "@/components/scroll-to-top";
import { GoogleAnalytics } from "@/components/google-analytics";
import { AnalyticsPageView } from "@/components/analytics-page-view";
import { RestaurantSchema } from "@/components/restaurant-schema";
import { MotionConfig } from "framer-motion";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abdculinaryevents.sn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ABD Culinary Events | Restaurant & Traiteur à Dakar",
    template: "%s | ABD Culinary Events",
  },
  description:
    "ABD Culinary Events, restaurant et service traiteur à Dakar. Réservation de table, pâtisserie sur-mesure et organisation de mariages, cocktails d'entreprise et événements privés.",
  keywords: [
    "traiteur Dakar",
    "restaurant Dakar",
    "cuisine sénégalaise",
    "traiteur mariage Sénégal",
    "pâtisserie Dakar",
    "ABD Culinary Events",
  ],
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName: "ABD Culinary Events",
    title: "ABD Culinary Events | Restaurant & Traiteur à Dakar",
    description:
      "Restaurant et service traiteur à Dakar. Réservation de table, pâtisserie sur-mesure et organisation d'événements.",
    url: siteUrl,
    images: [{ url: "/brand/abd-logo.png", width: 1200, height: 1200, alt: "ABD Culinary Events" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABD Culinary Events | Restaurant & Traiteur à Dakar",
    description: "Restaurant et service traiteur à Dakar.",
    images: ["/brand/abd-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-cream text-ink">
        <RestaurantSchema />
        <GoogleAnalytics />
        <MotionConfig reducedMotion="user">
          <CartProvider>
            <ScrollToTop />
            <AnalyticsPageView />
            <SiteHeader />
            <main className="pt-6 lg:pt-8">
              <PageTransition>{children}</PageTransition>
            </main>
            <SiteFooter />
            <CartDrawer />
            <FlyToCartLayer />
          </CartProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
