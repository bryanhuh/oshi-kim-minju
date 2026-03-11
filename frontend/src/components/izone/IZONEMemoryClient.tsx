"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface DBImage {
  id: number;
  url: string;
  category?: string;
  caption?: string;
  uploadedAt?: string;
}

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
    detail: "IZ*ONE disbanded in April 2021. The memories remain forever in fans' hearts.",
    color: "#f4a7c1",
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
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: s.duration, delay: s.delay, ease: "easeInOut" }}
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
        background: "linear-gradient(135deg, rgba(247,198,217,0.8), rgba(244,167,193,0.5))",
      }}
      animate={{ y: "110vh", x: [0, 20, -10, 15], rotate: [0, 180, 360], opacity: [0, 0.7, 0.7, 0] }}
      transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function IZONEMemoryClient() {
  const [revealed, setRevealed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<DBImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<DBImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`${API_BASE}/images?limit=20`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: DBImage[] = await res.json();
        setGalleryImages(data);
      } catch {
        setGalleryImages([]);
      } finally {
        setGalleryLoading(false);
      }
    }
    fetchImages();
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
        {/* ── Secret label & title ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[#f4a7c1]/50 text-xs tracking-[0.5em] mb-4">✦ SECRET ARCHIVE ✦</p>
          <h1
            className="font-[family-name:var(--font-noto-serif-kr)] text-5xl md:text-7xl font-light tracking-wider mb-4"
            style={{
              background: "linear-gradient(135deg, #f4a7c1 0%, #f7c6d9 50%, #e8809e 100%)",
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

        {/* ── Hero image — izone.webp ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="relative rounded-3xl overflow-hidden mb-20 shadow-2xl shadow-[#f4a7c1]/10"
          style={{ maxHeight: "440px" }}
        >
          <Image
            src="/izone.webp"
            alt="IZ*ONE — a memory"
            width={1200}
            height={440}
            className="w-full object-cover object-top"
            style={{ maxHeight: "440px" }}
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d12]/80 via-transparent to-[#1a0d12]/30" />
          {/* Side softening */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0d12]/50 via-transparent to-[#1a0d12]/50" />

          {/* Decorative top label */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-[#f7c6d9]/80 text-[9px] tracking-[0.4em] uppercase px-5 py-2 rounded-full">
              ✦ Produce 48 Graduates · Class of 2018 ✦
            </span>
          </div>

          {/* Bottom quote */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f7c6d9]/90 text-lg md:text-xl font-light italic leading-loose drop-shadow-lg">
              &ldquo;From the moment she stepped onto that stage, she became a dream that millions chose to believe in.&rdquo;
            </p>
            {/* Heart row */}
            <div className="flex justify-center gap-2 mt-4">
              {["♡", "✦", "♡", "✦", "♡"].map((s, i) => (
                <motion.span
                  key={i}
                  className="text-[#f4a7c1]/40 text-xs"
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Animated quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="text-center mb-20"
        >
          <blockquote className="text-[#f7c6d9]/60 text-lg md:text-xl font-[family-name:var(--font-noto-serif-kr)] font-light leading-loose italic">
            &ldquo;Eyes on me! 하나가 되는 순간 모두가 주목해!&rdquo;
          </blockquote>
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mb-20"
        >
          <p className="text-center text-[#f4a7c1]/50 text-xs tracking-[0.4em] mb-10">TIMELINE</p>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#f4a7c1]/30 to-transparent" />
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: revealed ? 1 : 0, x: revealed ? 0 : i % 2 === 0 ? -30 : 30 }}
                transition={{ duration: 0.8, delay: 1.5 + i * 0.2 }}
                className={`flex items-center gap-6 mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <p
                    className="text-2xl font-[family-name:var(--font-noto-serif-kr)] font-light mb-1"
                    style={{ color: item.color }}
                  >
                    {item.event}
                  </p>
                  <p className="text-[#f7c6d9]/40 text-sm leading-relaxed">{item.detail}</p>
                </div>
                <div className="relative flex-shrink-0">
                  <div className="w-3 h-3 rounded-full z-10 relative" style={{ backgroundColor: item.color }} />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[#f4a7c1]/30 text-xs tracking-widest">{item.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Rare Gallery — from DB ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 30 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <p className="text-center text-[#f4a7c1]/50 text-xs tracking-[0.4em] mb-8">RARE GALLERY</p>

          {galleryLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : galleryImages.length === 0 ? (
            <p className="text-center text-[#f7c6d9]/30 text-sm py-10">No images found in the archive.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.9 }}
                  transition={{ duration: 0.6, delay: 2.5 + i * 0.06 }}
                  className="group cursor-pointer relative overflow-hidden rounded-xl aspect-[2/3]"
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img.url}
                    alt={img.caption ?? `Photo ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d12]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-3">
                    {img.caption && (
                      <span className="text-[#f7c6d9]/80 text-xs tracking-wider line-clamp-2">
                        {img.caption}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-[#f4a7c1]/0 group-hover:ring-[#f4a7c1]/40 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 3.5 }}
          className="text-center mt-24"
        >
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-px h-12 bg-gradient-to-b from-[#f4a7c1]/40 to-transparent" />
            <p className="text-[#f7c6d9]/30 text-xs tracking-[0.3em]">이 페이지를 찾아주셔서 감사합니다</p>
            <p className="text-[#f7c6d9]/20 text-xs">Thank you for finding this hidden corner</p>
          </div>
        </motion.div>
      </div>

      {/* ── Lightbox ── */}
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
              <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.caption ?? "Gallery image"}
                  fill
                  className="object-cover"
                />
              </div>
              {selectedImage.caption && (
                <p className="text-center text-[#f7c6d9]/50 text-xs tracking-widest mt-3">
                  {selectedImage.caption}
                </p>
              )}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full text-white/60 text-xs flex items-center justify-center hover:text-white transition-colors"
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
