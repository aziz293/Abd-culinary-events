import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addMenuItem, getMenuItems } from "@/lib/content-store";

export async function GET() {
  const items = await getMenuItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json();
  if (!body.title || !body.category) {
    return NextResponse.json({ error: "Titre et catégorie requis." }, { status: 400 });
  }
  const created = await addMenuItem({
    title: body.title,
    description: body.description ?? "",
    price: Number(body.price) || 0,
    category: body.category,
    isChefSelection: Boolean(body.isChefSelection),
    isVegetarian: Boolean(body.isVegetarian),
    spiceLevel: body.spiceLevel ?? 0,
    imageUrl: body.imageUrl ?? "",
  });
  return NextResponse.json(created, { status: 201 });
}
