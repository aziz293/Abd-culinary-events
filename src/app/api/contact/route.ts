import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml } from "@/lib/email-template";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  try {
    await sendMail({
      subject: `Contact — ${subject} (${name})`,
      replyTo: email,
      html: buildEmailHtml("Nouveau message de contact", [
        { label: "Nom", value: name },
        { label: "E-mail", value: email },
        { label: "Téléphone", value: phone ?? "" },
        { label: "Objet", value: subject },
        { label: "Message", value: message },
      ]),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur d'envoi (contact) :", err);
    return NextResponse.json({ error: "L'envoi a échoué. Réessayez." }, { status: 500 });
  }
}
