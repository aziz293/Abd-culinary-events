"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'envoi.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">{label}</span>

      <div className="flex items-start gap-4">
        <div className="w-24 h-24 shrink-0 rounded-sm border border-ink/15 bg-cream-dim overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
          ) : (
            <span className="text-ink/30 text-xs px-2 text-center">Aucune photo</span>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-full font-mono text-xs uppercase tracking-widest hover:bg-noir disabled:opacity-60 transition-colors"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? "Envoi..." : "Choisir une photo"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-ink/15 rounded-full font-mono text-xs uppercase tracking-widest hover:border-ember hover:text-ember transition-colors"
              >
                <X size={13} /> Retirer
              </button>
            )}
          </div>
          {error && <p className="text-ember text-xs mt-2">{error}</p>}
          <p className="text-ink/40 text-xs mt-2">JPG, PNG, WEBP ou GIF, 8 Mo maximum.</p>
        </div>
      </div>
    </div>
  );
}
