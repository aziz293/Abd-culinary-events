import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getMenuItems, getGalleryItems, getEventOffers, getSiteSettings, getTestimonials } from "@/lib/content-store";
import { AdminDashboard } from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const [menu, gallery, offers, settings, testimonials] = await Promise.all([
    getMenuItems(),
    getGalleryItems(),
    getEventOffers(),
    getSiteSettings(),
    getTestimonials(),
  ]);

  return (
    <AdminDashboard
      initialMenu={menu}
      initialGallery={gallery}
      initialOffers={offers}
      initialSettings={settings}
      initialTestimonials={testimonials}
    />
  );
}
