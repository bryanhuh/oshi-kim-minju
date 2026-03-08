"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Work } from "@/types";

const TYPES = ["All", "Drama", "Movie", "Variety"];

const MDL_API_URL = "https://kuryana.tbdh.app/people/19884-kim-min-joo";

export default function DramasClient() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState("All");
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  useEffect(() => {
    async function getWorks() {
      try {
        const res = await fetch(MDL_API_URL);
        if (!res.ok) throw new Error("Failed to fetch works");
        const json = await res.json();

        const mdlWorks = json.data.works;
        const mappedWorks: Work[] = [];

        let idCount = 1;

        // Map Dramas
        if (mdlWorks.Drama) {
          mdlWorks.Drama.forEach((d: any) => {
            mappedWorks.push({
              id: idCount++,
              title: d.title.name,
              titleKorean: null,
              year: d.year === "TBA" ? null : parseInt(d.year),
              role: `${d.role.name} (${d.role.type})`,
              poster: null,
              synopsis: null,
              trailerUrl: null,
              type: "drama"
            });
          });
        }

        // Map Movies
        if (mdlWorks.Movie) {
          mdlWorks.Movie.forEach((m: any) => {
            mappedWorks.push({
              id: idCount++,
              title: m.title.name,
              titleKorean: null,
              year: m.year === "TBA" ? null : parseInt(m.year),
              role: `${m.role.name} (${m.role.type})`,
              poster: null,
              synopsis: null,
              trailerUrl: null,
              type: "movie"
            });
          });
        }

        // Map TV Shows to Variety
        if (mdlWorks["TV Show"]) {
          mdlWorks["TV Show"].forEach((s: any) => {
            mappedWorks.push({
              id: idCount++,
              title: s.title.name,
              titleKorean: null,
              year: s.year === "TBA" ? null : parseInt(s.year),
              role: `${s.role.name} (${s.role.type})`,
              poster: null,
              synopsis: null,
              trailerUrl: null,
              type: "variety"
            });
          });
        }

        // Sort by year descending (TBA at the top)
        mappedWorks.sort((a, b) => {
          if (a.year === null) return -1;
          if (b.year === null) return 1;
          return b.year - a.year;
        });

        setWorks(mappedWorks);
      } catch (err) {
        console.error("Error fetching works:", err);
        setError("Unable to load works at this time.");
      } finally {
        setLoading(false);
      }
    }

    getWorks();
  }, []);

  const filtered =
    activeType === "All"
      ? works
      : works.filter((w) => {
        const typeKey = activeType.toLowerCase();
        return w.type === typeKey;
      });

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <SectionHeader
        korean="작품"
        title="Dramas & Films"
        subtitle="All works featuring Kim Minju"
      />

      {/* Filter tabs */}
      <div className="flex justify-center gap-3 mb-16">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-500 ${activeType === type
              ? "bg-[#f4a7c1] text-white shadow-lg shadow-[#f4a7c1]/20 scale-105"
              : "glass text-[#2a1a20]/40 hover:text-[#e8809e] hover:bg-white/40"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-[#f4a7c1]/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-[#f4a7c1] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[#2a1a20]/30 text-[10px] uppercase tracking-[0.4em] animate-pulse">Refining Narrative</p>
        </div>
      ) : error ? (
        <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-[#e8809e] text-sm tracking-widest">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-[#2a1a20]/30 py-32 text-xs tracking-[0.3em] uppercase">
          No records found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedWork(work)}
                className="cursor-pointer group flex h-full"
              >
                <div className="glass-premium relative w-full p-8 rounded-[2rem] border border-[#f7c6d9]/20 group-hover:border-[#f4a7c1]/40 transition-all duration-700 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#f4a7c1]/5">
                  {/* Decorative background element */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#f4a7c1]/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-8 h-px bg-[#f4a7c1]/30" />
                      <p className="text-[#f4a7c1] text-[10px] font-semibold tracking-[0.3em] uppercase">
                        {work.year || "TBA"}
                      </p>
                    </div>

                    <h3 className="text-[#2a1a20] font-[family-name:var(--font-noto-serif-kr)] text-2xl mb-4 leading-tight group-hover:text-[#e8809e] transition-colors duration-500">
                      {work.title}
                    </h3>
                  </div>

                  <div className="relative z-10 pt-8 border-t border-[#2a1a20]/5 mt-auto">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[#2a1a20]/30 text-[9px] uppercase tracking-[0.2em] font-medium">Character / Role</p>
                      <p className="text-[#2a1a20]/60 text-xs tracking-wide leading-relaxed truncate group-hover:text-[#2a1a20]/80">
                        {work.role}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <span className="text-[10px] text-[#f4a7c1] font-medium tracking-widest uppercase">View Details</span>
                      <svg className="w-4 h-4 text-[#f4a7c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Category Badge (Floating) */}
                  <div className="absolute top-8 right-8 text-[9px] tracking-[0.2em] text-[#2a1a20]/20 uppercase font-bold transform rotate-90 origin-right transition-colors duration-500 group-hover:text-[#f4a7c1]/40">
                    {work.type}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2a1a20]/40 backdrop-blur-xl"
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass max-w-lg w-full rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl shadow-black/10 border border-white/40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accents */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#f4a7c1]/40 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <p className="font-bold text-[#f4a7c1] text-[11px] uppercase tracking-[0.4em]">
                    {selectedWork.year || "TBA"} Narrative
                  </p>
                  <span className="h-1 w-1 rounded-full bg-[#f4a7c1]/30" />
                  <p className="text-[#2a1a20]/30 text-[11px] uppercase tracking-[0.4em]">
                    {selectedWork.type}
                  </p>
                </div>

                <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-4xl text-[#2a1a20] mb-3 leading-tight tracking-tight">
                  {selectedWork.title}
                </h2>

                <div className="w-16 h-0.5 bg-gradient-to-r from-[#f4a7c1] to-transparent mb-10 rounded-full" />

                <div className="space-y-8">
                  <div className="bg-[#2a1a20]/5 rounded-2xl p-6 border border-white/20">
                    <p className="text-[#2a1a20]/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Professional Credit</p>
                    <p className="text-[#2a1a20]/80 text-base leading-relaxed font-medium">
                      {selectedWork.role}
                    </p>
                  </div>

                  {selectedWork.synopsis && (
                    <div className="px-2">
                      <p className="text-[#2a1a20]/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Overview</p>
                      <p className="text-[#2a1a20]/70 text-sm leading-relaxed italic">
                        {selectedWork.synopsis}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedWork(null)}
                  className="mt-12 w-full py-5 rounded-2xl bg-[#2a1a20] text-white text-[11px] tracking-[0.3em] hover:bg-[#f4a7c1] transition-all duration-500 uppercase font-bold shadow-lg shadow-black/10"
                >
                  Close Archive
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .glass-premium {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
}
