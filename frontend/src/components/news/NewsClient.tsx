"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import type { NewsItem } from "@/types";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function NewsClient({ news }: { news: NewsItem[] }) {
  return (
    <div className="px-6 max-w-4xl mx-auto">
      <SectionHeader
        korean="뉴스"
        title="News"
        subtitle="Latest headlines and articles featuring Kim Minju"
      />

      {news.length === 0 && (
        <p className="text-center text-[#2a1a20]/40 py-20 text-sm tracking-widest">
          No articles found.
        </p>
      )}

      <div className="space-y-4">
        {news.map((item, i) => (
          <GlassCard key={item.id} className="p-6 hover:border-[#f4a7c1]/40 border border-transparent transition-colors duration-300" delay={i * 0.08}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#f7c6d9] to-[#f4a7c1] flex items-center justify-center">
                <span className="text-white text-xs font-medium">{item.source?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-base leading-snug mb-2 hover:text-[#e8809e] transition-colors line-clamp-2 block"
                  >
                    {item.title}
                  </a>
                ) : (
                  <motion.h3
                    className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-base leading-snug mb-2 line-clamp-2"
                  >
                    {item.title}
                  </motion.h3>
                )}
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
