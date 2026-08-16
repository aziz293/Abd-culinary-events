import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml } from "@/lib/email-template";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventType, date, location, guestCount, services, budget, name, phone, email, notes } = body;

  if (!eventType || !date || !location || !guestCount || !budget || !name || !phone) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  try {
    await sendMail({
      subject: `Nouvelle demande de devis — ${name}`,
      replyTo: email || undefined,
      html: buildEmailHtml("Nouvelle demande de devis traiteur", [
        { label: "Nom", value: name },
        { label: "Téléphone", value: phone },
        { label: "E-mail", value: email ?? "" },
        { label: "Type d'événement", value: eventType },
        { label: "Date prévue", value: date },
        { label: "Lieu", value: location },
        { label: "Nombre d'invités", value: String(guestCount) },
        { label: "Prestations souhaitées", value: Array.isArray(services) ? services.join(", ") : "" },
        { label: "Budget estimé", value: budget },
        { label: "Précisions", value: notes ?? "" },
      ]),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur d'envoi (devis) :", err);
    return NextResponse.json({ error: "L'envoi a échoué. Réessayez." }, { status: 500 });
  }
}
