"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { InstagramPost } from "@/types";

const mockPosts: InstagramPost[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  postId: `post_${i + 1}`,
  imageUrl: `https://picsum.photos/seed/ig${i}/400/400`,
  caption: [
    "오늘도 행복한 하루 ☁️",
    "Spring has arrived 🌸",
    "Thank you for your love 💕",
    "새로운 시작 ✨",
    "Dream big 🌙",
    "꽃처럼 피어나 🌷",
    "Behind the scenes 📸",
    "Grateful every day 🤍",
  ][i % 8],
  likes: Math.floor(Math.random() * 500000) + 100000,
  postedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

function formatLikes(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function InstagramClient() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <SectionHeader
        korean="인스타그램"
        title="Instagram Archive"
        subtitle="Polaroid moments from Minju's world"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {mockPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20, rotate: (Math.random() - 0.5) * 6 }}
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
          >
            {/* Polaroid */}
            <div className="bg-white shadow-md rounded-sm p-2 pb-8 relative">
              <div className="relative aspect-square overflow-hidden">
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt="Instagram post"
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Caption on hover */}
              <AnimatePresence>
                {hoveredId === post.id && (
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

              {!hoveredId || hoveredId !== post.id ? (
                <div className="absolute inset-x-2 bottom-1 text-center">
                  <p className="text-[#2a1a20]/30 text-xs">
                    ♥ {post.likes ? formatLikes(post.likes) : ""}
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
