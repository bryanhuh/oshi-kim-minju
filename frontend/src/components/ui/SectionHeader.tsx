"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  korean?: string;
}

export default function SectionHeader({ title, subtitle, korean }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      {korean && (
        <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-sm tracking-[0.3em] mb-3">
          {korean}
        </p>
      )}
      <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-4xl md:text-5xl font-light text-[#2a1a20] mb-4 tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#2a1a20]/50 text-sm tracking-widest max-w-md mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#f4a7c1]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#f4a7c1]" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#f4a7c1]" />
      </div>
    </motion.div>
  );
}
