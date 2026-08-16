"use client";

import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export function FlyToCartLayer() {
  const { flyingItems, removeFlyingItem } = useCart();

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      {flyingItems.map((f) => (
        <motion.div
          key={f.key}
          initial={{
            left: f.startX,
            top: f.startY,
            x: "-50%",
            y: "-50%",
            scale: 1,
            opacity: 1,
          }}
          animate={{
            left: f.endX,
            top: f.endY,
            scale: 0.15,
            opacity: 0.4,
          }}
          transition={{ duration: 0.7, ease: [0.35, 0, 0.65, 1] }}
          onAnimationComplete={() => removeFlyingItem(f.key)}
          className="absolute w-14 h-14 rounded-full overflow-hidden border-2 border-brass shadow-lg"
        >
          {f.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-ember" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
