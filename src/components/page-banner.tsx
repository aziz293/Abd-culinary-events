"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/reveal-text";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function PageBanner({
  eyebrow,
  title,
  description,
  imageUrl,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-3 lg:px-6">
      <section className="relative w-full bg-noir text-cream overflow-hidden rounded-[2rem] shadow-xl shadow-black/20 border border-brass/15">
        <div className="absolute inset-0">
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              {/* voile sombre neutre pour garantir la lisibilité du texte, sans teinte de couleur */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
            </>
          ) : (
            <div className="absolute inset-0 bg-noir" />
          )}
        </div>

        <motion.div
          className="relative px-6 sm:px-10 pt-16 pb-24 sm:pt-24 sm:pb-32"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="max-w-xl">
            <motion.p variants={item} className="font-mono text-xs uppercase tracking-[0.25em] text-brass-bright mb-4">
              {eyebrow}
            </motion.p>
            <RevealText
              as="h1"
              text={title}
              trigger="mount"
              delay={0.2}
              className="font-display text-4xl sm:text-5xl leading-tight"
            />
            {description && (
              <motion.p variants={item} className="mt-4 text-base text-cream/80 max-w-lg">
                {description}
              </motion.p>
            )}
            {children && (
              <motion.div variants={item} className="mt-8">
                {children}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* badge rotatif, identique sur toutes les pages */}
        <div className="hidden md:flex absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-brass items-center justify-center p-4 lg:p-5 shadow-xl shadow-black/30 animate-[spin_50s_linear_infinite] motion-reduce:animate-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/abd-logo-light.png" alt="ABD Culinary Events" className="w-full h-full object-contain" />
        </div>
      </section>
    </div>
  );
}
