"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

export function MultiImageUploadField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  async function handleFiles(files: FileList) {
    const list = Array.from(files);
    setUploading(true);
    setError("");
    setProgress({ done: 0, total: list.length });

    const uploaded: string[] = [];
    for (const file of list) {
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Échec de l'envoi.");
        uploaded.push(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Échec de l'envoi d'une des photos.");
      } finally {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    if (uploaded.length) onChange([...values, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <span className="block font-mono text-xs uppercase tracking-widest text-ink/60 mb-2">{label}</span>

      {values.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
          {values.map((url, idx) => (
            <div key={url + idx} className="relative aspect-square rounded-sm overflow-hidden border border-ink/15 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                aria-label="Retirer cette photo"
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-noir/80 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length) handleFiles(e.target.files);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-full font-mono text-xs uppercase tracking-widest hover:bg-noir disabled:opacity-60 transition-colors"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? `Envoi ${progress.done}/${progress.total}...` : "Ajouter des photos"}
      </button>
      {error && <p className="text-ember text-xs mt-2">{error}</p>}
      <p className="text-ink/40 text-xs mt-2">
        Sélectionnez plusieurs fichiers d&apos;un coup (JPG, PNG, WEBP ou GIF, 8 Mo max chacun).
      </p>
    </div>
  );
}
