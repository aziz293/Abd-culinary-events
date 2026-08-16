import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml } from "@/lib/email-template";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, time, guests, name, phone, notes } = body;

  if (!date || !time || !guests || !name || !phone) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  try {
    await sendMail({
      subject: `Nouvelle réservation — ${name}`,
      html: buildEmailHtml("Nouvelle demande de réservation", [
        { label: "Nom", value: name },
        { label: "Téléphone", value: phone },
        { label: "Date", value: date },
        { label: "Heure", value: time },
        { label: "Nombre de personnes", value: String(guests) },
        { label: "Demandes spéciales", value: notes ?? "" },
      ]),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur d'envoi (réservation) :", err);
    return NextResponse.json({ error: "L'envoi a échoué. Réessayez." }, { status: 500 });
  }
}
