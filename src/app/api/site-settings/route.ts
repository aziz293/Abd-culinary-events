import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/content-store";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

const ALLOWED_KEYS = [
  "heroImageUrl",
  "conceptImage1Url",
  "conceptImage2Url",
  "restaurantBannerUrl",
  "restaurantChefImageUrl",
  "restaurantStrengthsImageUrl",
  "menuBannerUrl",
  "reservationBannerUrl",
  "traiteurBannerUrl",
  "devisBannerUrl",
  "galerieBannerUrl",
  "whatsappNumber",
  "dishOfTheDayId",
  "eveningDishId",
] as const;

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json();
  const patch: Record<string, string> = {};
  for (const key of ALLOWED_KEYS) {
    if (typeof body[key] === "string") patch[key] = body[key];
  }
  const updated = await updateSiteSettings(patch);
  return NextResponse.json(updated);
}
