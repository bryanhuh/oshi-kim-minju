"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const WorldScene = dynamic(() => import("./WorldScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#fde8f0] to-[#fdf7fa] flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-[#f4a7c1] text-sm tracking-[0.4em]"
      >
        Loading world...
      </motion.div>
    </div>
  ),
});

export default function WorldClient() {
  const router = useRouter();

  return (
    <div className="relative w-full h-full">
      {/* 3D World */}
      <div className="absolute inset-0">
        <WorldScene onNavigate={(href) => router.push(href)} />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#fdf7fa] to-transparent" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fdf7fa] to-transparent" />
      </div>

      {/* Header */}
      <div className="absolute top-20 left-0 right-0 z-20 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-xs tracking-[0.4em] mb-2"
        >
          김민주의 세계
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-noto-serif-kr)] text-3xl md:text-4xl font-light text-[#2a1a20] tracking-wider"
        >
          Her World
        </motion.h1>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
      >
        <p className="text-[#2a1a20]/40 text-xs tracking-[0.25em]">
          click a landmark to enter · drag to orbit · scroll to zoom
        </p>
      </motion.div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute top-20 left-6 z-20 pointer-events-auto"
      >
        <Link
          href="/"
          className="glass px-4 py-2 rounded-full text-xs text-[#2a1a20]/60 hover:text-[#e8809e] tracking-widest transition-colors duration-200"
        >
          ← Home
        </Link>
      </motion.div>
    </div>
  );
}
