"use client";

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
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#f7c6d9]/20">
      <SectionHeader
        korean="최신 뉴스"
        title="Breaking News"
        subtitle="Latest headlines and official announcements"
      />

      {news.length === 0 ? (
        <div className="glass rounded-3xl py-20 text-center">
          <p className="text-[#2a1a20]/30 text-xs tracking-[0.3em] uppercase">
            The archive is currently quiet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {news.slice(0, 6).map((item, i) => (
            <GlassCard
              key={item.id}
              className="p-8 group hover:border-[#f4a7c1]/40 border border-transparent transition-all duration-500 hover:shadow-xl hover:shadow-[#f4a7c1]/5"
              delay={i * 0.05}
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f7c6d9] to-[#f4a7c1] flex items-center justify-center shadow-lg shadow-[#f4a7c1]/20 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-lg font-serif">{item.source?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-[10px] text-[#f4a7c1] font-bold uppercase tracking-[0.2em] mb-2">
                    <span>{item.source}</span>
                    <span className="w-1 h-1 rounded-full bg-[#f4a7c1]/30" />
                    <span className="text-[#2a1a20]/30 font-medium">{formatDate(item.publishedAt)}</span>
                  </div>

                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-lg leading-tight mb-2 hover:text-[#e8809e] transition-colors line-clamp-2 block"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <h3 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-lg leading-tight mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
