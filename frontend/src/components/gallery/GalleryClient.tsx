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

const mockImages: GalleryImage[] = [
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
  {
    id: 5,
    url: "https://picsum.photos/seed/minju-trolley/800/1200",
    thumbnailUrl: "https://picsum.photos/seed/minju-trolley/400/600",
    category: "drama_still",
    source: "Trolley (MBC)",
    altText: "Kim Minju in Trolley MBC drama",
    uploadedAt: new Date().toISOString(),
  },
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

const mockPosts: InstagramPost[] = [
  {
    id: 1,
    postId: "C1abc123",
    imageUrl: "https://picsum.photos/seed/minju-ig1/600/600",
    caption: "새해 복 많이 받으세요 🌸 Happy New Year everyone, thank you for always being by my side 🤍",
    likes: 487234,
    postedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    postId: "C2def456",
    imageUrl: "https://picsum.photos/seed/minju-ig2/600/600",
    caption: "촬영 현장에서 💕 Behind the scenes today",
    likes: 412087,
    postedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 3,
    postId: "C3ghi789",
    imageUrl: "https://picsum.photos/seed/minju-ig3/600/600",
    caption: "별에게 물어봐 마지막 방송 💙 Thank you for watching Ask the Stars with us.",
    likes: 623540,
    postedAt: "2023-12-01T18:00:00Z",
  },
  {
    id: 4,
    postId: "C4jkl012",
    imageUrl: "https://picsum.photos/seed/minju-ig4/600/600",
    caption: "오늘도 행복한 하루 ☁️ 여러분 감사해요",
    likes: 389102,
    postedAt: "2023-11-10T09:00:00Z",
  },
  {
    id: 5,
    postId: "C5mno345",
    imageUrl: "https://picsum.photos/seed/minju-ig5/600/600",
    caption: "트롤리 잘 봐주셔서 감사합니다 💖 I'm so grateful for all your support for Trolley.",
    likes: 511876,
    postedAt: "2023-02-08T20:00:00Z",
  },
  {
    id: 6,
    postId: "C6pqr678",
    imageUrl: "https://picsum.photos/seed/minju-ig6/600/600",
    caption: "BLOOM*IZ 💐 꽃처럼 피어날게요",
    likes: 728904,
    postedAt: "2020-10-27T12:00:00Z",
  },
  {
    id: 7,
    postId: "C7stu901",
    imageUrl: "https://picsum.photos/seed/minju-ig7/600/600",
    caption: "아이즈원 데뷔 🌟 COLOR*IZ 많이 사랑해주세요!",
    likes: 912345,
    postedAt: "2018-10-29T00:00:00Z",
  },
  {
    id: 8,
    postId: "C8vwx234",
    imageUrl: "https://picsum.photos/seed/minju-ig8/600/600",
    caption: "팬미팅 너무 행복했어요 💗 I love you all so much, thank you for coming today!",
    likes: 456789,
    postedAt: "2023-11-06T19:00:00Z",
  },
  {
    id: 9,
    postId: "C9yza567",
    imageUrl: "https://picsum.photos/seed/minju-ig9/600/600",
    caption: "HEART*IZ 💜 La vie en rose 🌹",
    likes: 834521,
    postedAt: "2019-04-01T00:00:00Z",
  },
  {
    id: 10,
    postId: "C10bcd890",
    imageUrl: "https://picsum.photos/seed/minju-ig10/600/600",
    caption: "Spring is here 🌸 봄이 왔어요 오늘 날씨 너무 좋다",
    likes: 378654,
    postedAt: "2024-03-15T11:00:00Z",
  },
];

function formatLikes(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function GalleryClient() {
  const [section, setSection] = useState<"gallery" | "instagram">("gallery");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "3d">("grid");
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

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
              {mockPosts.map((post, i) => (
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
                  onMouseEnter={() => setHoveredPost(post.id)}
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
                          ♥ {post.likes ? formatLikes(post.likes) : ""}
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
