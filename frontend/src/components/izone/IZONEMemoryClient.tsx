"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TIMELINE = [
  {
    year: "2018",
    event: "Debut",
    detail: "IZ*ONE debuted on October 29, 2018 with LA VIE EN ROSE.",
    color: "#f4a7c1",
  },
  {
    year: "2019",
    event: "BLOOM*IZ",
    detail: "The group blossomed with their 1st full album, BLOOM*IZ.",
    color: "#e8809e",
  },
  {
    year: "2020",
    event: "ONEIRIC DIARY",
    detail: "A dreamlike chapter — ONEIRIC DIARY touched millions of hearts.",
    color: "#f7c6d9",
  },
  {
    year: "2021",
    event: "Farewell",
    detail:
      "IZ*ONE disbanded in April 2021. The memories remain forever in fans' hearts.",
    color: "#f4a7c1",
  },
];

const HIDDEN_IMAGES = [
  {
    id: 1,
    src: "https://picsum.photos/seed/izone-secret1/600/900",
    label: "La Vie en Rose era",
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/izone-secret2/600/900",
    label: "BLOOM*IZ era",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/izone-secret3/600/900",
    label: "HEART*IZ era",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/izone-secret4/600/900",
    label: "ONEIRIC DIARY",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/izone-secret5/600/900",
    label: "ONE-REELER",
  },
  {
    id: 6,
    src: "https://picsum.photos/seed/izone-secret6/600/900",
    label: "Final concert",
  },
];

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-[#f4a7c1]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.4, 1] }}
          transition={{
            repeat: Infinity,
            duration: s.duration,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingPetal({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        left: `${x}%`,
        top: "-20px",
        width: 8,
        height: 8,
        borderRadius: "50% 0 50% 0",
        background:
          "linear-gradient(135deg, rgba(247,198,217,0.8), rgba(244,167,193,0.5))",
      }}
      animate={{
        y: "110vh",
        x: [0, 20, -10, 15],
        rotate: [0, 180, 360],
        opacity: [0, 0.7, 0.7, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export default function IZONEMemoryClient() {
  const [revealed, setRevealed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    (typeof HIDDEN_IMAGES)[number] | null
  >(null);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const petals = Array.from({ length: 12 }, (_, i) => ({
    x: 5 + (i / 12) * 90,
    delay: i * 0.6,
  }));

  return (
    <div className="relative min-h-screen bg-[#1a0d12] overflow-hidden">
      <StarField />
      {petals.map((p, i) => (
        <FloatingPetal key={i} {...p} />
      ))}

      <div className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Secret label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[#f4a7c1]/50 text-xs tracking-[0.5em] mb-4">
            ✦ SECRET ARCHIVE ✦
          </p>
          <h1
            className="font-[family-name:var(--font-noto-serif-kr)] text-5xl md:text-7xl font-light tracking-wider mb-4"
            style={{
              background:
                "linear-gradient(135deg, #f4a7c1 0%, #f7c6d9 50%, #e8809e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            IZ*ONE Memory
          </h1>
          <p className="text-[#f7c6d9]/40 text-sm tracking-[0.3em]">
            아이즈원 — 영원히 기억될 이름
          </p>
          <p className="text-[#f7c6d9]/30 text-xs tracking-widest mt-1">
            A name that will be remembered forever
          </p>
        </motion.div>

        {/* Animated quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="text-center mb-20"
        >
          <blockquote className="text-[#f7c6d9]/60 text-lg md:text-xl font-[family-name:var(--font-noto-serif-kr)] font-light leading-loose italic">
            &ldquo;From the moment she stepped onto that stage, she became a
            dream that millions chose to believe in.&rdquo;
          </blockquote>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mb-20"
        >
          <p className="text-center text-[#f4a7c1]/50 text-xs tracking-[0.4em] mb-10">
            TIMELINE
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#f4a7c1]/30 to-transparent" />

            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{
                  opacity: revealed ? 1 : 0,
                  x: revealed ? 0 : i % 2 === 0 ? -30 : 30,
                }}
                transition={{ duration: 0.8, delay: 1.5 + i * 0.2 }}
                className={`flex items-center gap-6 mb-12 ${
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}
                >
                  <p
                    className="text-2xl font-[family-name:var(--font-noto-serif-kr)] font-light mb-1"
                    style={{ color: item.color }}
                  >
                    {item.event}
                  </p>
                  <p className="text-[#f7c6d9]/40 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                {/* Center dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-3 h-3 rounded-full z-10 relative"
                    style={{ backgroundColor: item.color }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      delay: i * 0.3,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[#f4a7c1]/30 text-xs tracking-widest">
                    {item.year}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hidden photo gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 30 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <p className="text-center text-[#f4a7c1]/50 text-xs tracking-[0.4em] mb-8">
            RARE GALLERY
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {HIDDEN_IMAGES.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: 2.5 + i * 0.1 }}
                className="group cursor-pointer relative overflow-hidden rounded-xl aspect-[2/3]"
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d12]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-3">
                  <span className="text-[#f7c6d9]/80 text-xs tracking-wider">
                    {img.label}
                  </span>
                </div>
                {/* Pink border glow on hover */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-[#f4a7c1]/0 group-hover:ring-[#f4a7c1]/40 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 3.5 }}
          className="text-center mt-24"
        >
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-px h-12 bg-gradient-to-b from-[#f4a7c1]/40 to-transparent" />
            <p className="text-[#f7c6d9]/30 text-xs tracking-[0.3em]">
              이 페이지를 찾아주셔서 감사합니다
            </p>
            <p className="text-[#f7c6d9]/20 text-xs">
              Thank you for finding this hidden corner
            </p>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a0d12]/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-sm w-full mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.label}
                width={600}
                height={900}
                className="w-full rounded-xl"
              />
              <p className="text-center text-[#f7c6d9]/50 text-xs tracking-widest mt-3">
                {selectedImage.label}
              </p>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 w-8 h-8 glass-dark rounded-full text-white/60 text-xs flex items-center justify-center hover:text-white transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
