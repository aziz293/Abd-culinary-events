import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteMenuItem, updateMenuItem } from "@/lib/content-store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await updateMenuItem(id, {
    title: body.title,
    description: body.description,
    price: body.price !== undefined ? Number(body.price) : undefined,
    category: body.category,
    isChefSelection: body.isChefSelection,
    spiceLevel: body.spiceLevel,
    imageUrl: body.imageUrl,
  });
  if (!updated) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  await deleteMenuItem(id);
  return NextResponse.json({ ok: true });
}
