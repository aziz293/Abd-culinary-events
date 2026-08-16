"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, PlayCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { galleryCategories } from "@/lib/data";
import type { GalleryItem } from "@/lib/content-store";

const gradients: Record<string, string> = {
  Buffets: "from-ember/30 via-brass/20 to-noir/10",
  "Pâtisserie": "from-brass/30 via-cream-dim to-ember/10",
  Mariages: "from-herb/20 via-brass/25 to-ember/15",
  "Événements d'entreprise": "from-noir/20 via-brass/15 to-herb/10",
};

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{6,})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/** Cover thumbnail that auto-cycles through an album's photos with a soft cross-fade. */
function AlbumCover({ item }: { item: GalleryItem }) {
  const images = item.images ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 2200);
    return () => clearInterval(id);
  }, [images.length]);

  if (!images.length) {
    return <div className={cn("absolute inset-0 bg-gradient-to-br", gradients[item.category])} />;
  }

  return (
    <>
      {images.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img + i}
          src={img}
          alt={item.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
    </>
  );
}

export function GalleryBrowser({ items: galleryItems }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<(typeof galleryCategories)[number] | "tous">("tous");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [slide, setSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered =
    active === "tous" ? galleryItems : galleryItems.filter((g) => g.category === active);

  function open(item: GalleryItem) {
    setSelected(item);
    setSlide(0);
    setShowVideo(!(item.images?.length > 0));
  }

  function close() {
    setSelected(null);
  }

  function next() {
    if (!selected) return;
    setShowVideo(false);
    setSlide((s) => (s + 1) % selected.images.length);
  }

  function prev() {
    if (!selected) return;
    setShowVideo(false);
    setSlide((s) => (s - 1 + selected.images.length) % selected.images.length);
  }

  // diaporama automatique dans la visionneuse quand il y a plusieurs photos
  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (!selected || showVideo || (selected.images?.length ?? 0) < 2) return;
    autoplayRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % selected.images.length);
    }, 3200);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [selected, showVideo]);

  const embedUrl = selected?.videoUrl ? youtubeEmbedUrl(selected.videoUrl) : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive("tous")}
          className={cn(
            "px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
            active === "tous" ? "bg-ember text-ink border-ember" : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
          )}
        >
          Tout
        </button>
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest border transition-colors",
              active === cat ? "bg-ember text-ink border-ember" : "border-ink/15 text-ink/60 hover:border-ember hover:text-ember"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <button key={item.id} onClick={() => open(item)} className="group text-left">
            <div className="aspect-[4/5] rounded-sm border border-ink/10 flex items-end p-4 transition-transform group-hover:-translate-y-1 overflow-hidden relative">
              <AlbumCover item={item} />
              <div className="relative flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/60 bg-cream/80 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                {item.images?.length > 1 && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink/60 bg-cream/80 px-2 py-1 rounded-full">
                    <ImagePlus size={10} /> {item.images.length}
                  </span>
                )}
                {item.videoUrl && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink/60 bg-cream/80 px-2 py-1 rounded-full">
                    <PlayCircle size={10} /> Vidéo
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-ink/75">{item.title}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-noir/90 flex items-center justify-center p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div
              className={cn(
                "aspect-[4/3] rounded-sm border border-brass/30 overflow-hidden relative",
                !selected.images?.length && !embedUrl && "bg-gradient-to-br",
                !selected.images?.length && !embedUrl && gradients[selected.category]
              )}
            >
              {showVideo && embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={selected.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selected.images?.length ? (
                <div className="absolute inset-0 flex h-full w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${slide * 100}%)` }}>
                  {selected.images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={img + i} src={img} alt={selected.title} className="w-full h-full object-cover shrink-0" />
                  ))}
                </div>
              ) : null}

              {!showVideo && selected.images?.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Photo précédente"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-noir/70 text-cream flex items-center justify-center hover:bg-noir"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Photo suivante"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-noir/70 text-cream flex items-center justify-center hover:bg-noir"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selected.images.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          i === slide ? "bg-cream" : "bg-cream/35"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-start justify-between mt-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-brass-bright">{selected.category}</p>
                <p className="text-cream mt-1">{selected.title}</p>
              </div>
              <button onClick={close} aria-label="Fermer" className="text-cream/60 hover:text-cream">
                <X size={20} />
              </button>
            </div>

            {(selected.images?.length > 1 || (embedUrl && selected.images?.length > 0)) && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {selected.images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => {
                      setShowVideo(false);
                      setSlide(i);
                    }}
                    className={cn(
                      "w-12 h-12 rounded-sm overflow-hidden border",
                      !showVideo && slide === i ? "border-brass-bright" : "border-brass/20"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {embedUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={cn(
                      "w-12 h-12 rounded-sm border flex items-center justify-center bg-noir/40",
                      showVideo ? "border-brass-bright text-brass-bright" : "border-brass/20 text-cream/60"
                    )}
                    aria-label="Voir la vidéo"
                  >
                    <PlayCircle size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
