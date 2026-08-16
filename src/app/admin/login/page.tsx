"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Connexion impossible.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-noir px-5">
      <div className="w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/abd-logo-light.png" alt="ABD Culinary Events" className="w-16 h-16 mx-auto mb-6 object-contain" />
        <h1 className="font-display text-2xl text-cream text-center mb-1">Espace administration</h1>
        <p className="text-cream/60 text-sm text-center mb-8">
          Réservé à l&apos;équipe ABD Culinary Events.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="block font-mono text-xs uppercase tracking-widest text-cream/60 mb-2">
              Mot de passe
            </span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream/5 border border-brass/30 rounded-sm px-4 py-2.5 text-cream focus:border-brass-bright outline-none transition-colors"
            />
          </label>
          {error && <p className="text-ember-bright text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-ember hover:bg-ember-bright disabled:opacity-60 text-ink rounded-full font-mono text-xs uppercase tracking-widest transition-colors"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
