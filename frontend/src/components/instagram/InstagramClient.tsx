"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { InstagramPost } from "@/types";

function formatLikes(n: number | null | undefined) {
  if (!n) return "";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function InstagramClient({ posts }: { posts: InstagramPost[] }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Lightbox state
  const [lightboxPost, setLightboxPost] = useState<InstagramPost | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const openLightbox = (post: InstagramPost) => {
    setLightboxPost(post);
    setImageIndex(0);
  };

  const closeLightbox = () => {
    setLightboxPost(null);
  };

  const navigate = (dir: number) => {
    if (!lightboxPost || !lightboxPost.images) return;
    const len = lightboxPost.images.length;
    setImageIndex((prev) => (prev + dir + len) % len);
  };

  useEffect(() => {
    if (lightboxPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [lightboxPost]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {posts.map((post, i) => (
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
            onMouseEnter={() => setHoveredId(post.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => openLightbox(post)}
          >
            <div className="bg-white shadow-md rounded-sm p-2 pb-8 relative group">
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

                {post.images && post.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/40 text-white rounded-full px-2 py-0.5 text-[10px] flex items-center gap-1 opacity-80 z-10 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
                    <span>{post.images.length}</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {hoveredId === post.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-2 bottom-1 text-center"
                  >
                    <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-[10px] leading-tight line-clamp-2">
                      <span className="font-semibold block mb-0.5">{formatDate(post.postedAt)}</span>
                      {(!post.caption || post.caption === "None") ? "♡" : post.caption}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {(!hoveredId || hoveredId !== post.id) && (
                <div className="absolute inset-x-2 bottom-1 text-center">
                  <p className="text-[#2a1a20]/40 text-[10px] font-medium tracking-wide">
                    {formatDate(post.postedAt)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] h-[100dvh] w-[100dvw] overflow-hidden bg-[#2a1a20]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 glass rounded-full text-white text-lg flex items-center justify-center hover:bg-white/20 transition-colors z-[110]"
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[95vw] md:max-w-6xl h-[85vh] md:h-[90vh] flex flex-col md:flex-row bg-white border border-white/10 rounded-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Area */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-0 md:h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={imageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full h-full flex items-center justify-center bg-black"
                  >
                    {(lightboxPost.images?.[imageIndex] || lightboxPost.imageUrl)?.endsWith('.mp4') || (lightboxPost.images?.[imageIndex] || lightboxPost.imageUrl)?.endsWith('.mov') ? (
                      <video
                        src={lightboxPost.images?.[imageIndex] || lightboxPost.imageUrl || ""}
                        controls
                        autoPlay
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={lightboxPost.images?.[imageIndex] || lightboxPost.imageUrl || ""}
                        alt="Instagram Media"
                        fill
                        className="object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {lightboxPost.images && lightboxPost.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full text-white flex items-center justify-center hover:scale-110 transition-all duration-300 z-10 shadow-lg"
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(1); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full text-white flex items-center justify-center hover:scale-110 transition-all duration-300 z-10 shadow-lg"
                    >
                      →
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-full flex gap-1.5 items-center z-10">
                      {lightboxPost.images.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === imageIndex ? 'bg-white scale-125' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar / Caption Area */}
              <div className="w-full md:w-80 lg:w-96 bg-white flex flex-col max-h-[40vh] md:max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
                    <div className="w-full h-full bg-white rounded-full overflow-hidden border border-white relative">
                      <Image src="/images/hero.jpg" alt="Minju" fill className="object-cover" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 leading-none mb-0.5">minn.__.ju</h4>
                    <span className="text-xs text-gray-500">{formatDate(lightboxPost.postedAt)}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto min-h-[100px] text-sm text-gray-800">
                  <div className="flex gap-3 mb-2">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
                      <div className="w-full h-full bg-white rounded-full overflow-hidden border border-white relative">
                        <Image src="/images/hero.jpg" alt="Minju" fill className="object-cover" />
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 mr-2">minn.__.ju</span>
                      <span className="font-[family-name:var(--font-noto-serif-kr)] whitespace-pre-wrap leading-relaxed">
                        {(!lightboxPost.caption || lightboxPost.caption === "None") ? "♡" : lightboxPost.caption}
                      </span>
                    </div>
                  </div>
                </div>

                {lightboxPost.likes ? (
                  <div className="p-4 border-t border-gray-100 flex shrink-0 items-center gap-2 text-gray-900">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#2a1a20]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    <span className="text-sm font-semibold">{formatLikes(lightboxPost.likes)} likes</span>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
