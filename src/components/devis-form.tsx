"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventTypeOptions, serviceOptions, budgetRanges } from "@/lib/data";

interface DevisData {
  eventType: string;
  date: string;
  location: string;
  guestCount: string;
  services: string[];
  budget: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const emptyData: DevisData = {
  eventType: "",
  date: "",
  location: "",
  guestCount: "",
  services: [],
  budget: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const stepLabels = ["Événement", "Logistique", "Prestations", "Budget & contact"];
type Channel = "email" | "whatsapp";

export function DevisForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DevisData>(emptyData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [whatsappNumber, setWhatsappNumber] = useState("221770000000");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((s) => {
        if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  const canProceed = () => {
    if (step === 0) return data.eventType !== "";
    if (step === 1) return data.date !== "" && data.location !== "" && data.guestCount !== "";
    if (step === 2) return data.services.length > 0;
    if (step === 3) return data.budget !== "" && data.name !== "" && data.phone !== "";
    return true;
  };

  function toggleService(service: string) {
    setData((d) => ({
      ...d,
      services: d.services.includes(service)
        ? d.services.filter((s) => s !== service)
        : [...d.services, service],
    }));
  }

  async function submit() {
    setSubmitting(true);
    setSendError("");

    if (channel === "whatsapp") {
      const lines = [
        "Bonjour ABD Culinary Events 👋",
        "",
        "Je souhaite un devis pour mon événement :",
        "",
        `Type d'événement : ${data.eventType}`,
        `Date prévue : ${data.date}`,
        `Lieu : ${data.location}`,
        `Nombre d'invités : ${data.guestCount}`,
        `Prestations souhaitées : ${data.services.join(", ")}`,
        `Budget estimé : ${data.budget}`,
        "",
        `Nom : ${data.name}`,
        `Téléphone : ${data.phone}`,
      ];
      if (data.email) lines.push(`E-mail : ${data.email}`);
      if (data.notes) lines.push(`Précisions : ${data.notes}`);
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank");
      setSubmitting(false);
      setSubmitted(true);
      return;
    }

    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSendError("L'envoi a échoué. Réessayez, ou passez par WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-6 border border-brass/30 rounded-sm bg-cream-dim max-w-xl mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/abd-logo.png" alt="ABD Culinary Events" className="w-20 h-20 mx-auto mb-6 object-contain" />
        <CheckCircle2 className="mx-auto text-herb mb-3" size={28} />
        <h3 className="font-display text-2xl mb-2">Votre demande est en route</h3>
        <p className="text-ink/85">
          {channel === "whatsapp"
            ? "Votre demande a été préparée sur WhatsApp — vérifiez qu'elle est bien envoyée."
            : "Un récapitulatif vient d'être envoyé à notre équipe."}{" "}
          L&apos;équipe ABD Culinary Events vous recontacte sous 48 heures pour
          affiner votre devis.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Choix du canal */}
      <div className="flex gap-2 mb-8">
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

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs shrink-0 border",
                i < step && "bg-herb border-herb text-cream",
                i === step && "bg-ember border-ember text-ink",
                i > step && "border-ink/20 text-ink/40"
              )}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden sm:block font-mono text-[11px] uppercase tracking-widest",
                i === step ? "text-ink" : "text-ink/40"
              )}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 && <div className="flex-1 h-px bg-ink/10" />}
          </div>
        ))}
      </div>

      <div className="border border-ink/10 bg-cream rounded-sm p-6 sm:p-8 ticket-edge-bottom">
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-xl mb-6">Quel type d&apos;événement organisez-vous ?</legend>
            <div className="grid sm:grid-cols-2 gap-3">
              {eventTypeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setData((d) => ({ ...d, eventType: option }))}
                  className={cn(
                    "text-left px-4 py-3 rounded-sm border font-medium text-sm transition-colors",
                    data.eventType === option
                      ? "border-ember bg-ember/10 text-ember"
                      : "border-ink/15 hover:border-ember/50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-5">
            <legend className="font-display text-xl mb-1">Logistique de l&apos;événement</legend>
            <Field label="Date prévue">
              <input
                type="date"
                value={data.date}
                onChange={(e) => setData((d) => ({ ...d, date: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Lieu / quartier à Dakar">
              <input
                type="text"
                placeholder="Almadies, Plateau, Ngor..."
                value={data.location}
                onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Nombre d'invités">
              <input
                type="number"
                min={1}
                value={data.guestCount}
                onChange={(e) => setData((d) => ({ ...d, guestCount: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-display text-xl mb-6">Quelles prestations souhaitez-vous ?</legend>
            <div className="grid sm:grid-cols-2 gap-3">
              {serviceOptions.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={cn(
                    "flex items-center gap-3 text-left px-4 py-3 rounded-sm border text-sm transition-colors",
                    data.services.includes(service)
                      ? "border-ember bg-ember/10 text-ember"
                      : "border-ink/15 hover:border-ember/50"
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center",
                      data.services.includes(service) ? "bg-ember border-ember" : "border-ink/30"
                    )}
                  >
                    {data.services.includes(service) && <Check size={11} className="text-ink" />}
                  </span>
                  {service}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-5">
            <legend className="font-display text-xl mb-1">Budget estimé et coordonnées</legend>
            <Field label="Budget estimé">
              <select
                value={data.budget}
                onChange={(e) => setData((d) => ({ ...d, budget: e.target.value }))}
                className={inputClass}
              >
                <option value="">Sélectionner...</option>
                {budgetRanges.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Nom complet">
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Téléphone WhatsApp">
                <input
                  type="tel"
                  placeholder="+221 77 000 00 00"
                  value={data.phone}
                  onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="E-mail">
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Précisions supplémentaires">
              <textarea
                rows={3}
                value={data.notes}
                onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </fieldset>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink/60 disabled:opacity-0 hover:text-ink"
        >
          <ArrowLeft size={14} /> Précédent
        </button>

        {step < stepLabels.length - 1 ? (
          <button
            type="button"
            onClick={() => canProceed() && setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-ember hover:bg-ember-bright disabled:opacity-40 disabled:hover:bg-ember text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Suivant <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canProceed() || submitting}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 disabled:opacity-40 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors",
              channel === "whatsapp" ? "bg-[#25D366] hover:brightness-95 text-white" : "bg-ember hover:bg-ember-bright"
            )}
          >
            {submitting ? "Envoi..." : channel === "whatsapp" ? "Envoyer sur WhatsApp" : "Envoyer ma demande"}
          </button>
        )}
      </div>
      {sendError && <p className="text-ember text-sm mt-3">{sendError}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-cream border border-ink/15 rounded-sm px-4 py-2.5 text-sm focus:border-ember outline-none transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">{label}</span>
      {children}
    </label>
  );
}
