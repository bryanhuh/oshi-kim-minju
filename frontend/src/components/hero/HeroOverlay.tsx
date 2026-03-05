"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#fdf7fa] to-transparent" />

      <div className="text-center px-6 pointer-events-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-sm tracking-[0.4em] mb-6"
        >
          김민주의 세계에 오신 것을 환영합니다
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-6xl md:text-8xl font-light text-[#2a1a20] tracking-wider mb-4"
        >
          Kim Minju
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="text-[#2a1a20]/50 text-sm tracking-[0.3em] mb-10"
        >
          Actor · Model · IZ*ONE
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/profile"
            className="px-8 py-3 bg-[#f4a7c1] text-white text-sm tracking-widest rounded-full hover:bg-[#e8809e] transition-colors duration-300 pink-glow"
          >
            Enter Her World
          </Link>
          <Link
            href="/gallery"
            className="px-8 py-3 glass text-[#2a1a20] text-sm tracking-widest rounded-full hover:bg-white/80 transition-colors duration-300"
          >
            View Gallery
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[#2a1a20]/40 text-xs tracking-[0.3em]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#f4a7c1] to-transparent"
        />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fdf7fa] to-transparent" />
    </div>
  );
}
