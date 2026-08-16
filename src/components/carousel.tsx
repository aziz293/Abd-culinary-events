"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({
  children,
  itemClassName = "",
}: {
  children: React.ReactNode[];
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || pausedRef.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  function scroll(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  if (children.length === 0) return null;

  return (
    <div
      className="relative group/carousel"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(-1)}
        aria-label="Précédent"
        className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-cream shadow-lg border border-ink/10 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:border-ember z-10"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Suivant"
        className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-cream shadow-lg border border-ink/10 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:border-ember z-10"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
