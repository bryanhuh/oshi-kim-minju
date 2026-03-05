"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Work } from "@/types";

const mockWorks: Work[] = [
  {
    id: 1,
    title: "Ask the Stars",
    titleKorean: "별에게 물어봐",
    year: 2023,
    role: "Oh Bok-soon",
    poster: "https://image.tmdb.org/t/p/w500/8S3RB0l5NJ4RZMV1anFjFcSHJjE.jpg",
    synopsis:
      "A romantic comedy set in space. Oh Bok-soon is a crew member aboard the first commercial space station. A surgeon boards the station and the two fall in love.",
    trailerUrl: null,
    type: "drama",
  },
  {
    id: 2,
    title: "Trolley",
    titleKorean: "트롤리",
    year: 2022,
    role: "Kim Soo-bin",
    poster: "https://image.tmdb.org/t/p/w500/qbGlLVHiDLjBLVTSJWbMtFHBkrB.jpg",
    synopsis:
      "A politician's wife with a dark secret is forced into a moral dilemma. Kim Soo-bin is a high school student whose life becomes entangled in the political scandal.",
    trailerUrl: null,
    type: "drama",
  },
  {
    id: 3,
    title: "The Midnight Studio",
    titleKorean: "심야화실",
    year: 2024,
    role: "Hong Ye-seul",
    poster: "https://image.tmdb.org/t/p/w500/7rHVXaIhLd4kCBhGxnBqjGSSM9r.jpg",
    synopsis:
      "A midnight art studio where a young woman discovers a mysterious painter who only works at night. Hong Ye-seul is an art student drawn into the world of the studio.",
    trailerUrl: null,
    type: "drama",
  },
  {
    id: 4,
    title: "Welcome to Waikiki 2",
    titleKorean: "으라차차 와이키키 2",
    year: 2019,
    role: "Han Yoon-ah",
    poster: "https://image.tmdb.org/t/p/w500/m53SYwOSBCQHFv8D3xlwm0xYQce.jpg",
    synopsis:
      "The second season of the comedy series about three dreamers running a guesthouse in Itaewon, Seoul. Minju plays Han Yoon-ah, a cheerful young woman connected to the guesthouse crew.",
    trailerUrl: null,
    type: "drama",
  },
  {
    id: 5,
    title: "Produce 48",
    titleKorean: "프로듀스 48",
    year: 2018,
    role: "Contestant (Finalist)",
    poster: "https://image.tmdb.org/t/p/w500/6C2HYhGMSMkWgRiDJ8LGwcVwX1Q.jpg",
    synopsis:
      "A collaboration survival show between Mnet and AKB48. 96 Korean and Japanese trainees compete for 12 spots in a new K-pop group IZ*ONE. Minju finished in 12th place.",
    trailerUrl: null,
    type: "variety",
  },
  {
    id: 6,
    title: "IZ*ONE Chu",
    titleKorean: "아이즈원츄",
    year: 2018,
    role: "Herself",
    poster: null,
    synopsis:
      "A reality web series following the daily lives and activities of the IZ*ONE members. Minju's warm personality and natural humor made her a fan favorite on the show.",
    trailerUrl: null,
    type: "variety",
  },
];

const TYPES = ["All", "Drama", "Movie", "Variety"];

export default function DramasClient() {
  const [activeType, setActiveType] = useState("All");
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const filtered = activeType === "All"
    ? mockWorks
    : mockWorks.filter((w) => w.type?.toLowerCase() === activeType.toLowerCase());

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
            className={`px-5 py-2 rounded-full text-sm tracking-widest transition-all duration-300 ${
              activeType === type
                ? "bg-[#f4a7c1] text-white pink-glow"
                : "glass text-[#2a1a20]/60 hover:text-[#e8809e]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
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
                {work.poster ? (
                  <Image
                    src={work.poster}
                    alt={work.title ?? ""}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fde8f0] to-[#f7c6d9] flex items-center justify-center">
                    <span className="font-[family-name:var(--font-noto-serif-kr)] text-[#e8809e]/60 text-4xl">
                      {work.titleKorean?.[0] ?? work.title?.[0]}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a20]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
