"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-[#f4a7c1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#2a1a20]/40 text-xs tracking-[0.2em] animate-pulse">LOADING WORKS</p>
        </div>
      ) : error ? (
        <p className="text-center text-[#e8809e] py-20 text-sm tracking-widest">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-[#2a1a20]/40 py-20 text-sm tracking-widest">
          No works found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                onClick={() => setSelectedWork(work)}
                className="cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[2/3] glass border border-[#f7c6d9]/30 hover:border-[#f4a7c1]/50 transition-all duration-500 shadow-sm group-hover:shadow-md">
                  <Image
                    src={`https://picsum.photos/seed/drama-${work.id}/400/600`}
                    alt={work.title ?? ""}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a20]/80 via-[#2a1a20]/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[#f7c6d9] text-[10px] uppercase tracking-[0.2em] mb-1.5 font-medium">
                      {work.year || "TBA"} • {work.type}
                    </p>
                    <h3 className="text-white font-[family-name:var(--font-noto-serif-kr)] text-xl leading-tight mb-2">{work.title}</h3>
                    <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">{work.role}</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2a1a20]/60 backdrop-blur-md"
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass max-w-md w-full rounded-3xl p-10 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative z-10">
                <p className="font-medium text-[#f4a7c1] text-[10px] uppercase tracking-[0.3em] mb-3">
                  {selectedWork.year || "TBA"} · {selectedWork.type}
                </p>
                <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-3xl text-[#2a1a20] mb-2 leading-tight">
                  {selectedWork.title}
                </h2>
                <div className="w-10 h-0.5 bg-[#f4a7c1]/30 mb-6" />

                <div className="space-y-4">
                  <div>
                    <p className="text-[#2a1a20]/40 text-[10px] uppercase tracking-widest mb-1.5">Role Details</p>
                    <p className="text-[#2a1a20]/70 text-sm leading-relaxed">
                      {selectedWork.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedWork(null)}
                  className="mt-10 w-full py-4 rounded-xl border border-[#f4a7c1]/20 text-[#e8809e] text-xs tracking-[0.2em] hover:bg-[#f4a7c1] hover:text-white transition-all duration-300 uppercase font-medium"
                >
                  Close Narrative
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
