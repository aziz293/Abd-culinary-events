import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, getAdminPassword } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (typeof password !== "string" || password !== getAdminPassword()) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
