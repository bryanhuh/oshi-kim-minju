"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fde8f0] to-[#fdf7fa]">
      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#f7c6d9]/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#f4a7c1]/20" />

      {/* The image in the center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="relative z-10 w-64 h-80 md:w-80 md:h-[26rem] rounded-2xl overflow-hidden shadow-2xl shadow-[#f4a7c1]/20"
      >
        <Image
          src="/oshi.jpg"
          alt="Kim Minju"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Title text moved to the right corner */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-20 text-right">
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-sm tracking-[0.4em] mb-2"
        >
          프로필
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-4xl md:text-6xl font-light text-[#2a1a20] tracking-wider mb-2"
        >
          Kim Minju
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-lg md:text-xl text-[#2a1a20]/60 tracking-widest"
        >
          김민주
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-6 ml-auto w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-[#f4a7c1] to-transparent origin-right"
        />
      </div>
    </section>
  );
}
