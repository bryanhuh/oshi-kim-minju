"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

function TransitionPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 5 + (i / 14) * 90,
        delay: (i / 14) * 0.5,
        size: 7 + (i % 4) * 4,
        drift: ((i % 3) - 1) * 25,
        rotate: i * 37,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-[199] pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            borderRadius: "50% 0 50% 0",
            background:
              "linear-gradient(135deg, rgba(247,198,217,0.95), rgba(244,167,193,0.7))",
            rotate: p.rotate,
          }}
          initial={{ y: -20, opacity: 0, x: 0 }}
          animate={{
            y: "115vh",
            opacity: [0, 0.85, 0.85, 0.3, 0],
            x: p.drift,
            rotate: p.rotate + 540,
          }}
          transition={{
            duration: 2.0,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

export default function TransitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Pink bloom that radiates in then fades away */}
        <motion.div
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="fixed inset-0 z-[198] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, rgba(247,198,217,1) 0%, rgba(253,232,240,0.85) 35%, rgba(253,247,250,0.5) 65%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* Falling petals */}
        <TransitionPetals />

        {/* Page content drifts up into place */}
        <motion.div
          initial={{ y: 22, filter: "blur(6px)" }}
          animate={{ y: 0, filter: "blur(0px)" }}
          exit={{ y: -10, filter: "blur(2px)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
