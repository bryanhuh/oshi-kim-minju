"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { GalleryImage } from "@/types";

const CATEGORIES = ["All", "Photoshoot", "Drama Still", "Event", "Magazine"];

const mockImages: GalleryImage[] = [
  // Photoshoots
  {
    id: 1,
    url: "https://i.pinimg.com/originals/28/78/f5/2878f5e2d8f1d4a4e7e7c5e6b3f1a2d9.jpg",
    thumbnailUrl: "https://i.pinimg.com/736x/28/78/f5/2878f5e2d8f1d4a4e7e7c5e6b3f1a2d9.jpg",
    category: "photoshoot",
    source: "Cosmopolitan Korea",
    altText: "Kim Minju Cosmopolitan photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 2,
    url: "https://i.pinimg.com/originals/c1/e2/3f/c1e23f4d5a6b7c8d9e0f1a2b3c4d5e6f.jpg",
    thumbnailUrl: "https://i.pinimg.com/736x/c1/e2/3f/c1e23f4d5a6b7c8d9e0f1a2b3c4d5e6f.jpg",
    category: "photoshoot",
    source: "Marie Claire Korea",
    altText: "Kim Minju Marie Claire photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  // Drama stills — Ask the Stars
  {
    id: 3,
    url: "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_893876_16993804235042714.jpg",
    thumbnailUrl: "https://file.mk.co.kr/meet/neds/2023/11/image_readtop_2023_893876_16993804235042714.jpg",
    category: "drama_still",
    source: "Ask the Stars (ENA)",
    altText: "Kim Minju in Ask the Stars",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 4,
    url: "https://img.hankyung.com/photo/202311/AA.35133282.1.jpg",
    thumbnailUrl: "https://img.hankyung.com/photo/202311/AA.35133282.1.jpg",
    category: "drama_still",
    source: "Ask the Stars (ENA)",
    altText: "Kim Minju in Ask the Stars space scene",
    uploadedAt: new Date().toISOString(),
  },
  // Drama stills — Trolley
  {
    id: 5,
    url: "https://file.mk.co.kr/meet/neds/2023/01/image_readtop_2023_51624_16730474864823174.jpg",
    thumbnailUrl: "https://file.mk.co.kr/meet/neds/2023/01/image_readtop_2023_51624_16730474864823174.jpg",
    category: "drama_still",
    source: "Trolley (MBC)",
    altText: "Kim Minju in Trolley MBC drama",
    uploadedAt: new Date().toISOString(),
  },
  // Events
  {
    id: 6,
    url: "https://dispatch.cdnser.be/cms-content/uploads/2023/11/06/5fa3c8bc-6d8b-4c6e-9b0e-9f7e1e3e2c1a.jpg",
    thumbnailUrl: "https://dispatch.cdnser.be/cms-content/uploads/2023/11/06/5fa3c8bc-6d8b-4c6e-9b0e-9f7e1e3e2c1a.jpg",
    category: "event",
    source: "Dispatch",
    altText: "Kim Minju fan event",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 7,
    url: "https://dispatch.cdnser.be/cms-content/uploads/2024/03/15/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    thumbnailUrl: "https://dispatch.cdnser.be/cms-content/uploads/2024/03/15/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    category: "event",
    source: "Dispatch",
    altText: "Kim Minju award ceremony",
    uploadedAt: new Date().toISOString(),
  },
  // Magazine
  {
    id: 8,
    url: "https://file.mk.co.kr/meet/neds/2024/01/image_readtop_2024_48231_17058021264502418.jpg",
    thumbnailUrl: "https://file.mk.co.kr/meet/neds/2024/01/image_readtop_2024_48231_17058021264502418.jpg",
    category: "magazine",
    source: "Vogue Korea",
    altText: "Kim Minju Vogue Korea magazine cover",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 9,
    url: "https://img.hankyung.com/photo/202401/AA.35899411.1.jpg",
    thumbnailUrl: "https://img.hankyung.com/photo/202401/AA.35899411.1.jpg",
    category: "magazine",
    source: "Elle Korea",
    altText: "Kim Minju Elle Korea feature",
    uploadedAt: new Date().toISOString(),
  },
  // More photoshoots (IZ*ONE era)
  {
    id: 10,
    url: "https://file.mk.co.kr/meet/neds/2020/09/image_readtop_2020_950437_15994734404498044.jpg",
    thumbnailUrl: "https://file.mk.co.kr/meet/neds/2020/09/image_readtop_2020_950437_15994734404498044.jpg",
    category: "photoshoot",
    source: "IZ*ONE BLOOM*IZ era",
    altText: "Kim Minju IZ*ONE BLOOM*IZ photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 11,
    url: "https://img.hankyung.com/photo/201812/AA.18551611.1.jpg",
    thumbnailUrl: "https://img.hankyung.com/photo/201812/AA.18551611.1.jpg",
    category: "photoshoot",
    source: "IZ*ONE debut era",
    altText: "Kim Minju IZ*ONE COLOR*IZ debut photoshoot",
    uploadedAt: new Date().toISOString(),
  },
  // IZ*ONE event
  {
    id: 12,
    url: "https://dispatch.cdnser.be/cms-content/uploads/2019/09/02/79e4c7a5-4f3a-4b6e-8d2c-1e9f2b3a4c5d.jpg",
    thumbnailUrl: "https://dispatch.cdnser.be/cms-content/uploads/2019/09/02/79e4c7a5-4f3a-4b6e-8d2c-1e9f2b3a4c5d.jpg",
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

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
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
      </div>

      {/* Masonry grid */}
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
                  // Fallback to gradient placeholder on image error
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

      {/* Lightbox */}
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
