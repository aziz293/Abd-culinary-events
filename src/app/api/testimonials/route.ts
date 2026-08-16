import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addTestimonial, getTestimonials } from "@/lib/content-store";

export async function GET() {
  const items = await getTestimonials();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json();
  if (!body.quote || !body.author) {
    return NextResponse.json({ error: "Avis et nom du client requis." }, { status: 400 });
  }
  const created = await addTestimonial({
    quote: body.quote,
    author: body.author,
    context: body.context ?? "",
  });
  return NextResponse.json(created, { status: 201 });
}
