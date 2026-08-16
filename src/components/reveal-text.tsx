"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const word = {
  hidden: { opacity: 0, y: "0.4em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function RevealText({
  text,
  as: Tag = "span",
  className,
  trigger = "view",
  delay = 0,
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3";
  className?: string;
  trigger?: "mount" | "view";
  delay?: number;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  const viewProps =
    trigger === "view"
      ? { whileInView: "show" as const, viewport: { once: true, margin: "-80px" } }
      : { animate: "show" as const };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      transition={{ delayChildren: delay }}
      {...viewProps}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className="inline-block mr-[0.25em]">
          {w}
        </motion.span>
      ))}
    </MotionTag>
  );
}
