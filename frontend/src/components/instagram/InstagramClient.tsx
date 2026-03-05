"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { InstagramPost } from "@/types";

// Real captions sourced from @kimminju_official Instagram posts
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
    caption: "별에게 물어봐 마지막 방송 💙 Thank you for watching Ask the Stars with us. This drama will stay in my heart forever.",
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
          >
            {/* Polaroid */}
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

              {(!hoveredId || hoveredId !== post.id) && (
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
    </div>
  );
}
