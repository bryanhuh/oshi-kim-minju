"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import type { NewsItem } from "@/types";

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Kim Minju Confirmed for Lead Role in Upcoming Romance Drama",
    source: "Soompi",
    url: null,
    publishedAt: "2025-02-15T09:00:00Z",
  },
  {
    id: 2,
    title: "김민주, 새 드라마 주연 발탁 '기대 폭발'",
    source: "Naver News",
    url: null,
    publishedAt: "2025-02-14T10:30:00Z",
  },
  {
    id: 3,
    title: "Kim Minju Stars in New Ad Campaign for Luxury Brand",
    source: "Koreaboo",
    url: null,
    publishedAt: "2025-02-10T08:00:00Z",
  },
  {
    id: 4,
    title: "김민주, 화보 촬영 현장 공개... '빛나는 비주얼'",
    source: "Sports Seoul",
    url: null,
    publishedAt: "2025-02-05T11:00:00Z",
  },
  {
    id: 5,
    title: "Former IZ*ONE Member Kim Minju Praised for Acting in Latest Drama",
    source: "AllKPop",
    url: null,
    publishedAt: "2025-01-28T14:00:00Z",
  },
  {
    id: 6,
    title: "김민주, 팬미팅 성료... '팬들과 행복한 시간'",
    source: "Osen",
    url: null,
    publishedAt: "2025-01-20T09:00:00Z",
  },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function NewsClient() {
  return (
    <div className="px-6 max-w-4xl mx-auto">
      <SectionHeader
        korean="뉴스"
        title="News"
        subtitle="Latest headlines and articles featuring Kim Minju"
      />

      <div className="space-y-4">
        {mockNews.map((item, i) => (
          <GlassCard key={item.id} className="p-6 hover:border-[#f4a7c1]/40 border border-transparent transition-colors duration-300" delay={i * 0.08}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#f7c6d9] to-[#f4a7c1] flex items-center justify-center">
                <span className="text-white text-xs font-medium">{item.source?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <motion.h3
                  className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-base leading-snug mb-2 hover:text-[#e8809e] transition-colors cursor-pointer line-clamp-2"
                >
                  {item.title}
                </motion.h3>
                <div className="flex items-center gap-3 text-xs text-[#2a1a20]/40">
                  <span className="text-[#f4a7c1]">{item.source}</span>
                  <span>·</span>
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
