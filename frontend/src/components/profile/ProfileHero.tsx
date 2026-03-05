"use client";

import { motion } from "framer-motion";

export default function ProfileHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fde8f0] to-[#fdf7fa]">
      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#f7c6d9]/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#f4a7c1]/20" />

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-sm tracking-[0.4em] mb-4"
        >
          프로필
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-5xl md:text-7xl font-light text-[#2a1a20] tracking-wider mb-4"
        >
          Kim Minju
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-xl text-[#2a1a20]/60 tracking-widest"
        >
          김민주
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-8 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#f4a7c1] to-transparent"
        />
      </div>
    </section>
  );
}
