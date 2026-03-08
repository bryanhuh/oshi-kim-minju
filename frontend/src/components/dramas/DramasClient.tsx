"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { getProxyImageUrl, needsProxy } from "@/lib/api";
import type { Work } from "@/types";

const TYPES = ["All", "Drama", "Movie", "Variety", "Videos"];

export default function DramasClient({ works }: { works: Work[] }) {
  const [activeType, setActiveType] = useState("All");
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const filtered =
    activeType === "All"
      ? works
      : works.filter((w) => {
        const typeKey = activeType === "Videos" ? "video" : activeType.toLowerCase();
        return w.type?.toLowerCase() === typeKey;
      });

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <SectionHeader
        korean="작품"
        title="Dramas & Films"
        subtitle="All works featuring Kim Minju"
      />

      {/* Filter tabs */}
      <div className="flex justify-center gap-3 mb-12">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-5 py-2 rounded-full text-sm tracking-widest transition-all duration-300 ${activeType === type
              ? "bg-[#f4a7c1] text-white pink-glow"
              : "glass text-[#2a1a20]/60 hover:text-[#e8809e]"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 && (
        <p className="text-center text-[#2a1a20]/40 py-20 text-sm tracking-widest">
          No works found.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((work, i) => (
            <motion.div
              key={work.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => setSelectedWork(work)}
              className="cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[2/3] glass border border-[#f7c6d9]/30 hover:border-[#f4a7c1]/50 transition-all duration-500">
                <Image
                  src={work.poster ? (work.poster.startsWith("/") ? work.poster : (getProxyImageUrl(work.poster) as string)) : `https://picsum.photos/seed/drama-${work.id}/400/600`}
                  alt={work.title ?? ""}
                  fill
                  unoptimized={needsProxy(work.poster)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("picsum.photos")) {
                      target.src = `https://picsum.photos/seed/drama-${work.id}/400/600`;
                      target.srcset = ""; // Clear srcset to force loading new src
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a20]/70 via-[#2a1a20]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <p className="text-[#f7c6d9] text-xs tracking-widest mb-1">{work.year}</p>
                  <h3 className="text-white font-[family-name:var(--font-noto-serif-kr)] text-lg">{work.title}</h3>
                  <p className="text-white/70 text-xs mt-1">{work.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2a1a20]/40 backdrop-blur-sm"
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass max-w-md w-full rounded-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-xs tracking-[0.3em] mb-2">
                {selectedWork.year} · {selectedWork.type}
              </p>
              <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-2xl text-[#2a1a20] mb-1">
                {selectedWork.title}
              </h2>
              {selectedWork.titleKorean && (
                <p className="text-[#2a1a20]/50 text-sm mb-4">{selectedWork.titleKorean}</p>
              )}
              <p className="text-[#2a1a20]/60 text-xs tracking-widest mb-4">
                Role: {selectedWork.role}
              </p>
              {selectedWork.synopsis && (
                <p className="text-[#2a1a20]/70 text-sm leading-relaxed">{selectedWork.synopsis}</p>
              )}
              <button
                onClick={() => setSelectedWork(null)}
                className="mt-6 text-[#e8809e] text-xs tracking-widest hover:text-[#f4a7c1] transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
