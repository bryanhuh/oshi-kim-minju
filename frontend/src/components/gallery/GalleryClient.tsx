"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/ui/SectionHeader";
import type { GalleryImage } from "@/types";

const Gallery3DScene = dynamic(() => import("./Gallery3DScene"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl flex items-center justify-center"
      style={{ height: "68vh", background: "linear-gradient(to bottom, #fde8f0, #fdf7fa)" }}
    >
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="text-[#f4a7c1] text-xs tracking-[0.4em]"
      >
        Loading 3D gallery...
      </motion.p>
    </div>
  ),
});

const CATEGORIES = ["All", "Photoshoot", "Drama Still", "Event", "Magazine"];

const mockImages: GalleryImage[] = [
  // Photoshoots
  {
    id: 1,
    url: "https://picsum.photos/seed/minju-cosmo/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-cosmo/400/600",
    category: "photoshoot",
    source: "Cosmopolitan Korea",
    altText: "Kim Minju Cosmopolitan photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 2,
    url: "https://picsum.photos/seed/minju-marie/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-marie/400/600",
    category: "photoshoot",
    source: "Marie Claire Korea",
    altText: "Kim Minju Marie Claire photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  // Drama stills — Ask the Stars
  {
    id: 3,
    url: "https://picsum.photos/seed/minju-stars/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-stars/400/600",
    category: "drama_still",
    source: "Ask the Stars (ENA)",
    altText: "Kim Minju in Ask the Stars",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 4,
    url: "https://picsum.photos/seed/minju-stars2/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-stars2/400/600",
    category: "drama_still",
    source: "Ask the Stars (ENA)",
    altText: "Kim Minju in Ask the Stars space scene",
    uploadedAt: new Date().toISOString(),
  },
  // Drama stills — Trolley
  {
    id: 5,
    url: "https://picsum.photos/seed/minju-trolley/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-trolley/400/600",
    category: "drama_still",
    source: "Trolley (MBC)",
    altText: "Kim Minju in Trolley MBC drama",
    uploadedAt: new Date().toISOString(),
  },
  // Events
  {
    id: 6,
    url: "https://picsum.photos/seed/minju-event1/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-event1/400/600",
    category: "event",
    source: "Dispatch",
    altText: "Kim Minju fan event",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 7,
    url: "https://picsum.photos/seed/minju-award/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-award/400/600",
    category: "event",
    source: "Dispatch",
    altText: "Kim Minju award ceremony",
    uploadedAt: new Date().toISOString(),
  },
  // Magazine
  {
    id: 8,
    url: "https://picsum.photos/seed/minju-vogue/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-vogue/400/600",
    category: "magazine",
    source: "Vogue Korea",
    altText: "Kim Minju Vogue Korea magazine cover",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 9,
    url: "https://picsum.photos/seed/minju-elle/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-elle/400/600",
    category: "magazine",
    source: "Elle Korea",
    altText: "Kim Minju Elle Korea feature",
    uploadedAt: new Date().toISOString(),
  },
  // More photoshoots (IZ*ONE era)
  {
    id: 10,
    url: "https://picsum.photos/seed/minju-bloomiz/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-bloomiz/400/600",
    category: "photoshoot",
    source: "IZ*ONE BLOOM*IZ era",
    altText: "Kim Minju IZ*ONE BLOOM*IZ photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 11,
    url: "https://picsum.photos/seed/minju-coloriz/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-coloriz/400/600",
    category: "photoshoot",
    source: "IZ*ONE debut era",
    altText: "Kim Minju IZ*ONE COLOR*IZ debut photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  // IZ*ONE event
  {
    id: 12,
    url: "https://picsum.photos/seed/minju-concert/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-concert/400/600",
    category: "event",
    source: "Dispatch",
    altText: "Kim Minju IZ*ONE concert",
    uploadedAt: new Date().toISOString(),
  },
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "3d">("grid");

  const filtered = activeCategory === "All"
    ? mockImages
    : mockImages.filter((img) => {
      const cat = activeCategory.toLowerCase().replace(" ", "_");
      return img.category === cat;
    });

  const openLightbox = useCallback((img: GalleryImage, index: number) => {
    setLightboxImage(img);
    setLightboxIndex(index);
  }, []);

  const navigate = useCallback((dir: number) => {
    const newIndex = (lightboxIndex + dir + filtered.length) % filtered.length;
    setLightboxIndex(newIndex);
    setLightboxImage(filtered[newIndex]);
  }, [lightboxIndex, filtered]);

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <SectionHeader
        korean="갤러리"
        title="Gallery"
        subtitle="A visual journey through Minju's world"
      />

      {/* View mode toggle + category filter */}
      <div className="flex flex-col items-center gap-5 mb-12">
        {/* Mode toggle */}
        <div className="glass rounded-full p-1 flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-5 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-[#f4a7c1] text-white"
                : "text-[#2a1a20]/50 hover:text-[#e8809e]"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`px-5 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${
              viewMode === "3d"
                ? "bg-[#f4a7c1] text-white"
                : "text-[#2a1a20]/50 hover:text-[#e8809e]"
            }`}
          >
            3D Museum
          </button>
        </div>

        {/* Category filter — only in grid mode */}
        <AnimatePresence>
          {viewMode === "grid" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm tracking-widest transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-[#f4a7c1] text-white pink-glow"
                      : "glass text-[#2a1a20]/60 hover:text-[#e8809e]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3D Museum Mode */}
      <AnimatePresence mode="wait">
        {viewMode === "3d" && (
          <motion.div
            key="3d"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <Gallery3DScene
              images={mockImages}
              onImageClick={(img) => {
                const idx = mockImages.findIndex((m) => m.id === img.id);
                openLightbox(img, idx >= 0 ? idx : 0);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masonry grid */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.5) }}
                  className="break-inside-avoid mb-3 group cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => openLightbox(img, i)}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src={img.thumbnailUrl ?? img.url}
                      alt={img.altText ?? "Kim Minju"}
                      width={400}
                      height={i % 3 === 0 ? 600 : 400}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a20]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-3">
                      <div>
                        <span className="text-white/70 text-xs tracking-widest block">
                          {img.category?.replace("_", " ")}
                        </span>
                        {img.source && (
                          <span className="text-white/50 text-xs">{img.source}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox — always accessible regardless of view mode */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2a1a20]/90 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-3xl max-h-[90vh] mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage.url}
                alt={lightboxImage.altText ?? "Kim Minju"}
                width={800}
                height={1000}
                className="object-contain max-h-[80vh] rounded-xl"
              />

              {/* Source label */}
              {lightboxImage.source && (
                <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-full">
                  <span className="text-white/70 text-xs">{lightboxImage.source}</span>
                </div>
              )}

              {/* Close */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 w-8 h-8 glass rounded-full text-white text-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ✕
              </button>

              {/* Navigation */}
              <button
                onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
