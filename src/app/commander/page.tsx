"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LocateFixed, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type Mode = "retrait" | "livraison";

export default function CommanderPage() {
  const router = useRouter();
  const { items, setQty, removeItem, totalPrice, clear } = useCart();

  const [mode, setMode] = useState<Mode>("retrait");
  const [address, setAddress] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("221770000000");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((s) => {
        if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("La localisation n'est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Localisation refusée — autorisez l'accès à votre position, ou indiquez l'adresse à la main.");
        } else {
          setLocationError("Impossible de récupérer votre position. Indiquez l'adresse à la main.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function buildMessage() {
    const lines = [
      "Bonjour ABD Culinary Events 👋",
      "",
      "Je souhaite passer la commande suivante :",
      "",
      "🍽️ NOUVELLE COMMANDE",
      "",
      ...items.map(
        (i) => `• ${i.title} x${i.qty} — ${(i.price * i.qty).toLocaleString("fr-FR")} F`
      ),
      "",
      `Total : ${totalPrice.toLocaleString("fr-FR")} F`,
      "",
      `Mode : ${mode === "retrait" ? "Retrait sur place" : "Livraison"}`,
    ];
    if (mode === "livraison" && address) lines.push(`Adresse : ${address}`);
    if (mode === "livraison" && locationLink) lines.push(`Position exacte (GPS) : ${locationLink}`);
    if (time) lines.push(`Heure souhaitée : ${time}`);
    lines.push("");
    lines.push(`Nom : ${name}`);
    lines.push(`Téléphone : ${phone}`);
    if (note) {
      lines.push("");
      lines.push(`Note : ${note}`);
    }
    return lines.join("\n");
  }

  function submit() {
    if (!name.trim() || !phone.trim()) {
      setError("Merci de renseigner votre nom et votre téléphone.");
      return;
    }
    if (mode === "livraison" && !address.trim() && !locationLink) {
      setError("Merci de renseigner une adresse ou de partager votre position.");
      return;
    }
    setError("");
    const message = buildMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clear();
    router.push("/menu");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display text-2xl mb-3">Votre panier est vide</h1>
        <p className="text-ink/80 mb-8">Ajoutez des plats depuis le menu pour passer commande.</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ember hover:bg-ember-bright text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
        >
          Voir le menu <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-ember mb-3">Commande</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-10">Finaliser ma commande</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-lg mb-4">Votre panier</h2>
          <ul className="space-y-4 mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 border-b border-ink/10 pb-4">
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label="Diminuer la quantité"
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-ink/20 hover:border-ember hover:text-ember"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-sm font-mono">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label="Augmenter la quantité"
                      className="w-6 h-6 flex items-center justify-center rounded-full border border-ink/20 hover:border-ember hover:text-ember"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm">{(item.price * item.qty).toLocaleString("fr-FR")} F</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Retirer"
                    className="mt-2 text-ink/40 hover:text-ember"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-ink/60">Total</span>
            <span className="font-display text-2xl">{totalPrice.toLocaleString("fr-FR")} F</span>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg mb-4">Vos informations</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              {(["retrait", "livraison"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 px-4 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors ${
                    mode === m
                      ? "bg-ember text-ink border-ember"
                      : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
                  }`}
                >
                  {m === "retrait" ? "Retrait sur place" : "Livraison"}
                </button>
              ))}
            </div>

            {mode === "livraison" && (
              <>
                <Field label="Adresse de livraison">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Quartier, rue, point de repère..."
                    className={inputClass}
                  />
                </Field>

                <div>
                  <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-ember/50 text-ember rounded-full font-mono text-xs uppercase tracking-widest hover:bg-ember hover:text-ink hover:border-ember disabled:opacity-60 transition-colors"
                  >
                    <LocateFixed size={14} />
                    {locating ? "Localisation en cours..." : "Utiliser ma position actuelle"}
                  </button>
                  {locationLink && (
                    <p className="text-herb text-xs mt-2">
                      ✓ Position exacte ajoutée — le livreur recevra un lien Google Maps direct.
                    </p>
                  )}
                  {locationError && <p className="text-ember text-xs mt-2">{locationError}</p>}
                  <p className="text-ink/40 text-xs mt-2">
                    Fonctionne mieux avec l&apos;adresse ci-dessus (quartier, point de repère) en complément.
                  </p>
                </div>
              </>
            )}

            <Field label="Heure souhaitée (optionnel)">
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Aujourd'hui, 13h00"
                className={inputClass}
              />
            </Field>

            <Field label="Nom complet">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>

            <Field label="Téléphone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
                className={inputClass}
              />
            </Field>

            <Field label="Note (optionnel)">
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
            </Field>

            {error && <p className="text-ember text-sm">{error}</p>}

            <button
              onClick={submit}
              className="w-full mt-2 px-6 py-3.5 bg-[#25D366] hover:brightness-95 text-white rounded-full font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Envoyer la commande sur WhatsApp
            </button>
            <p className="text-ink/40 text-xs text-center">
              Un message pré-rempli s&apos;ouvrira dans WhatsApp — vous n&apos;avez plus qu&apos;à l&apos;envoyer.
            </p>
          </div>
        </div>
      </div>
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
