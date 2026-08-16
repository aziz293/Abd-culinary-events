import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "L'envoi d'e-mail n'est pas configuré. Ajoutez GMAIL_USER et GMAIL_APP_PASSWORD dans .env.local."
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

export async function sendMail({
  subject,
  html,
  replyTo,
}: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const user = process.env.GMAIL_USER;
  if (!user) {
    throw new Error("GMAIL_USER n'est pas configuré.");
  }

  await getTransporter().sendMail({
    from: `ABD Culinary Events — Site web <${user}>`,
    to: user,
    replyTo,
    subject,
    html,
  });
}
