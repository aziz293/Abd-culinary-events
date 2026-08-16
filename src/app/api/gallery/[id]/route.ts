import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteGalleryItem, updateGalleryItem } from "@/lib/content-store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await updateGalleryItem(id, {
    title: body.title,
    category: body.category,
    images: Array.isArray(body.images) ? body.images : undefined,
    videoUrl: body.videoUrl,
  });
  if (!updated) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  await deleteGalleryItem(id);
  return NextResponse.json({ ok: true });
}
