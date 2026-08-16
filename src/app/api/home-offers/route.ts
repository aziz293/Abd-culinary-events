import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getEventOffers, updateEventOffer } from "@/lib/content-store";

export async function GET() {
  const items = await getEventOffers();
  return NextResponse.json(items);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "Identifiant requis." }, { status: 400 });
  }
  const updated = await updateEventOffer(body.id, {
    title: body.title,
    description: body.description,
    imageUrl: body.imageUrl,
  });
  if (!updated) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}
