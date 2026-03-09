"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getProxyImageUrl, needsProxy } from "@/lib/api";
import type { GalleryImage, InstagramPost } from "@/types";

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

export default function GalleryClient({
  initialImages,
  initialInstagram
}: {
  initialImages: GalleryImage[];
  initialInstagram: InstagramPost[];
}) {
  const [section, setSection] = useState<"gallery" | "instagram">("gallery");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "3d">("grid");
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? initialImages
    : initialImages.filter((img) => {
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
      {/* Custom section header with Gallery • Instagram tabs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-sm tracking-[0.3em] mb-3">
          {section === "gallery" ? "갤러리" : "인스타그램"}
        </p>
        <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-4xl md:text-5xl font-light text-[#2a1a20] mb-4 tracking-wide">
          <button
            onClick={() => setSection("gallery")}
            className={`transition-colors duration-300 ${section === "gallery" ? "text-[#2a1a20]" : "text-[#2a1a20]/30 hover:text-[#e8809e]"
              }`}
          >
            Gallery
          </button>
          <span className="mx-3 text-[#f4a7c1]/60 font-light">•</span>
          <button
            onClick={() => setSection("instagram")}
            className={`transition-colors duration-300 ${section === "instagram" ? "text-[#2a1a20]" : "text-[#2a1a20]/30 hover:text-[#e8809e]"
              }`}
          >
            Instagram
          </button>
        </h2>
        <p className="text-[#2a1a20]/50 text-sm tracking-widest max-w-md mx-auto">
          {section === "gallery"
            ? "A visual journey through Minju's world"
            : "Polaroid moments from Minju's world"}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#f4a7c1]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#f4a7c1]" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#f4a7c1]" />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {section === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* View mode toggle + category filter */}
            <div className="flex flex-col items-center gap-5 mb-12">
              <div className="glass rounded-full p-1 flex gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-5 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${viewMode === "grid"
                    ? "bg-[#f4a7c1] text-white"
                    : "text-[#2a1a20]/50 hover:text-[#e8809e]"
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`px-5 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${viewMode === "3d"
                    ? "bg-[#f4a7c1] text-white"
                    : "text-[#2a1a20]/50 hover:text-[#e8809e]"
                    }`}
                >
                  3D Museum
                </button>
              </div>

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
                        className={`px-5 py-2 rounded-full text-sm tracking-widest transition-all duration-300 ${activeCategory === cat
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
                    images={initialImages}
                    onImageClick={(img) => {
                      const idx = initialImages.findIndex((m) => m.id === img.id);
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
                            src={getProxyImageUrl(img.thumbnailUrl) || getProxyImageUrl(img.url) || ""}
                            alt={img.altText ?? "Kim Minju"}
                            width={400}
                            height={i % 3 === 0 ? 600 : 400}
                            unoptimized={needsProxy(img.thumbnailUrl) || needsProxy(img.url)}
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
          </motion.div>
        )}

        {section === "instagram" && (
          <motion.div
            key="instagram"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {initialInstagram.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20, rotate: (i % 5 - 2) * 1.5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    zIndex: 10,
                    transition: { duration: 0.3 },
                  }}
                  style={{ rotate: (i % 5 - 2) * 1.5 }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPost(post.id as number)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <div className="bg-white shadow-md rounded-sm p-2 pb-8 relative">
                    <div className="relative aspect-square overflow-hidden bg-[#fde8f0]">
                      {post.imageUrl && (
                        <Image
                          src={post.imageUrl}
                          alt="Instagram post"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                          unoptimized={needsProxy(post.imageUrl)}
                        />
                      )}
                    </div>

                    <AnimatePresence>
                      {hoveredPost === post.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-x-2 bottom-1 text-center"
                        >
                          <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-xs leading-tight line-clamp-2">
                            {post.caption}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {(!hoveredPost || hoveredPost !== post.id) && (
                      <div className="absolute inset-x-2 bottom-1 text-center">
                        <p className="text-[#2a1a20]/30 text-xs">
                          ♥ {post.likes ? (post.likes >= 1000000 ? `${(post.likes / 1000000).toFixed(1)}M` : post.likes >= 1000 ? `${(post.likes / 1000).toFixed(0)}K` : post.likes) : ""}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                src={getProxyImageUrl(lightboxImage.url) as string}
                alt={lightboxImage.altText ?? "Kim Minju"}
                width={800}
                height={1000}
                unoptimized={needsProxy(lightboxImage.url)}
                className="object-contain max-h-[80vh] rounded-xl"
              />

              {lightboxImage.source && (
                <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-full">
                  <span className="text-white/70 text-xs">{lightboxImage.source}</span>
                </div>
              )}

              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 w-8 h-8 glass rounded-full text-white text-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ✕
              </button>

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
