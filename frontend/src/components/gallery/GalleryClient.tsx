"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { GalleryImage } from "@/types";

const CATEGORIES = ["All", "Photoshoot", "Drama Still", "Event", "Magazine"];

// Placeholder items showing the layout with placeholder images
const mockImages: GalleryImage[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/seed/minju${i}/600/800`,
  thumbnailUrl: `https://picsum.photos/seed/minju${i}/300/400`,
  category: (["photoshoot", "drama_still", "event", "magazine"] as const)[i % 4],
  source: "placeholder",
  altText: `Kim Minju photo ${i + 1}`,
  uploadedAt: new Date().toISOString(),
}));

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
            transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.5) }}
            className="break-inside-avoid mb-3 group cursor-pointer overflow-hidden rounded-xl"
            onClick={() => openLightbox(img, i)}
          >
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={img.thumbnailUrl ?? img.url}
                alt={img.altText ?? "Kim Minju"}
                width={300}
                height={i % 3 === 0 ? 450 : 300}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a20]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-3">
                <span className="text-white/70 text-xs tracking-widest">
                  {img.category?.replace("_", " ")}
                </span>
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
