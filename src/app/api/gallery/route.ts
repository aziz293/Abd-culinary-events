import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addGalleryItem, getGalleryItems } from "@/lib/content-store";

export async function GET() {
  const items = await getGalleryItems();
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
  const created = await addGalleryItem({
    title: body.title,
    category: body.category,
    images: Array.isArray(body.images) ? body.images : [],
    videoUrl: body.videoUrl ?? "",
  });
  return NextResponse.json(created, { status: 201 });
}
