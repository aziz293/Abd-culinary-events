"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  date: z.string().min(1, "Choisissez une date"),
  time: z.string().min(1, "Choisissez une heure"),
  guests: z.coerce.number().min(1, "Au moins 1 personne").max(30, "Pour plus de 30 personnes, passez par le devis traiteur"),
  name: z.string().min(2, "Votre nom est requis"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  notes: z.string().optional(),
});

type FormValues = z.input<typeof schema>;
type Channel = "email" | "whatsapp";

export function ReservationForm() {
  const [channel, setChannel] = useState<Channel>("email");
  const [whatsappNumber, setWhatsappNumber] = useState("221770000000");
  const [sendError, setSendError] = useState("");
  const [waSent, setWaSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) as never });

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((s) => {
        if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(values: FormValues) {
    setSendError("");

    if (channel === "whatsapp") {
      const lines = [
        "Bonjour ABD Culinary Events 👋",
        "",
        "Je souhaite réserver une table :",
        "",
        `Date : ${values.date}`,
        `Heure : ${values.time}`,
        `Nombre de personnes : ${values.guests}`,
        `Nom : ${values.name}`,
        `Téléphone : ${values.phone}`,
      ];
      if (values.notes) lines.push(`Demandes spéciales : ${values.notes}`);
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank");
      setWaSent(true);
      return;
    }

    const res = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setSendError("L'envoi a échoué. Réessayez ou appelez-nous directement.");
      throw new Error("send failed");
    }
  }

  if ((isSubmitSuccessful && !sendError) || waSent) {
    return (
      <div className="text-center py-16 px-6 border border-brass/30 rounded-sm bg-cream-dim">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/abd-logo.png" alt="ABD Culinary Events" className="w-20 h-20 mx-auto mb-6 object-contain" />
        <CheckCircle2 className="mx-auto text-herb mb-3" size={28} />
        <h3 className="font-display text-2xl mb-2">Demande envoyée</h3>
        <p className="text-ink/85 max-w-sm mx-auto">
          Votre demande de réservation a bien été transmise. L&apos;équipe vous
          confirme la table par téléphone dans les meilleurs délais.
        </p>
        <button
          onClick={() => {
            setSendError("");
            setWaSent(false);
            reset();
          }}
          className="mt-6 font-mono text-xs uppercase tracking-widest text-ember hover:text-ember-bright"
        >
          Faire une nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="flex gap-2 mb-6">
        {(["email", "whatsapp"] as Channel[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            className={cn(
              "px-4 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
              channel === c
                ? "bg-ember text-ink border-ember"
                : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
            )}
          >
            {c === "email" ? "Par e-mail" : "Par WhatsApp"}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
      <Field label="Date" error={errors.date?.message}>
        <input type="date" {...register("date")} className={inputClass} />
      </Field>
      <Field label="Heure" error={errors.time?.message}>
        <input type="time" {...register("time")} className={inputClass} />
      </Field>
      <Field label="Nombre de personnes" error={errors.guests?.message}>
        <input type="number" min={1} max={30} {...register("guests")} className={inputClass} />
      </Field>
      <Field label="Téléphone" error={errors.phone?.message}>
        <input type="tel" placeholder="+221 77 000 00 00" {...register("phone")} className={inputClass} />
      </Field>
      <Field label="Nom complet" error={errors.name?.message} className="sm:col-span-2">
        <input type="text" {...register("name")} className={inputClass} />
      </Field>
      <Field label="Demandes spéciales" className="sm:col-span-2">
        <textarea rows={3} {...register("notes")} className={inputClass} placeholder="Allergies, occasion particulière, préférence de table..." />
      </Field>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full sm:w-auto mt-6 px-6 py-3 disabled:opacity-60 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors",
          channel === "whatsapp" ? "bg-[#25D366] hover:brightness-95 text-white" : "bg-ember hover:bg-ember-bright"
        )}
      >
        {isSubmitting
          ? "Envoi en cours..."
          : channel === "whatsapp"
          ? "Envoyer sur WhatsApp"
          : "Confirmer la demande"}
      </button>
      {sendError && <p className="text-ember text-sm mt-2">{sendError}</p>}
    </form>
  );
}

const inputClass =
  "w-full bg-cream border border-ink/15 rounded-sm px-4 py-2.5 text-sm focus:border-ember outline-none transition-colors";

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">
        {label}
      </span>
      {children}
      {error && <span className="block mt-1.5 text-xs text-ember">{error}</span>}
    </label>
  );
}
