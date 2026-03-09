"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

interface Track {
  name: string;
  duration: string;
}

interface Album {
  id: string;
  title: string;
  type: string;
  releaseDate: string;
  region: string;
  coverUrl: string;
  tracks: Track[];
}

interface IZONEClientProps {
  initialAlbums: Album[]; // Using local JSON data
}

const members = [
  "Jang Wonyoung", "Miyawaki Sakura", "Jo Yuri", "Choi Yena",
  "Ahn Yujin", "Nako", "Kwon Eunbi", "Kang Hyewon",
  "Hitomi", "Kim Chaewon", "Kim Minju", "Lee Chaeyeon",
];

const milestones = [
  { date: "2018.08.31", event: "IZ*ONE formed through Produce 48" },
  { date: "2018.10.29", event: "Official debut with 'La Vie en Rose'" },
  { date: "2019.04.01", event: "HEART*IZ — 'Violeta' becomes massive hit" },
  { date: "2020.01.06", event: "BLOOM*IZ — First full album release" },
  { date: "2021.04.29", event: "IZ*ONE officially disbands" },
];

function AlbumCard({ album, index }: { album: Album; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <GlassCard
        className={`overflow-hidden transition-all duration-500 cursor-pointer ${isOpen ? "ring-2 ring-[#f4a7c1]/40 shadow-2xl shadow-[#f4a7c1]/10" : "hover:border-[#f4a7c1]/30"
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col md:flex-row gap-6 p-4">
          {/* Cover Art */}
          <div className="relative w-full md:w-32 h-44 md:h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-[#f4a7c1] font-bold uppercase tracking-[0.2em]">
                {new Date(album.releaseDate).getFullYear()}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#2a1a20]/10" />
              <span className="text-[10px] text-[#2a1a20]/40 uppercase tracking-widest leading-none">
                {album.type}
              </span>
            </div>

            <h3 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-xl font-light leading-tight mb-2 group-hover:text-[#e8809e] transition-colors line-clamp-2">
              {album.title}
            </h3>

            <button className="text-[10px] text-[#f4a7c1] font-medium uppercase tracking-[0.1em] flex items-center gap-2 group/btn">
              {isOpen ? "Close Tracks" : "Explore Songs"}
              <motion.span
                animate={{ x: isOpen ? 0 : 3 }}
                className="text-lg leading-none"
              >
                {isOpen ? "−" : "→"}
              </motion.span>
            </button>
          </div>
        </div>

        {/* Tracks List */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#f7c6d9]/10 bg-white/5"
            >
              <div className="p-6 space-y-3">
                {album.tracks.map((track, i) => (
                  <div key={i} className="flex items-center gap-4 group/track">
                    <span className="text-[10px] font-mono text-[#2a1a20]/20 w-4">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-sm text-[#2a1a20]/70 group-hover/track:text-[#2a1a20] transition-colors line-clamp-1">
                      {track.name}
                    </p>
                    <span className="text-[10px] text-[#2a1a20]/30 font-mono">
                      {track.duration}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

export default function IZONEClient({ initialAlbums }: IZONEClientProps) {
  return (
    <div className="px-6 max-w-6xl mx-auto">
      <SectionHeader
        korean="아이즈원"
        title="IZ*ONE Era"
        subtitle="2018 – 2021 · A chapter that lives forever in our hearts"
      />

      {/* Hero quote with decorative background blob */}
      <div className="relative mb-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f7c6d9]/20 blur-[100px] rounded-full -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center"
        >
          <p className="font-[family-name:var(--font-noto-serif-kr)] text-3xl md:text-4xl font-light text-[#2a1a20] italic leading-relaxed max-w-3xl mx-auto">
            &ldquo;Thank you for making us a constellation&rdquo;
          </p>
          <p className="mt-6 text-[#f4a7c1] text-[10px] font-bold tracking-[0.6em] uppercase">
            IZ*ONE Final Concert Highlight
          </p>
        </motion.div>
      </div>

      {/* Members Section */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-3xl font-light whitespace-nowrap">
            The Members
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-[#f4a7c1]/40 to-transparent" />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {members.map((member, i) => (
            <motion.div
              key={member}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`px-6 py-3 rounded-2xl text-xs border transition-all duration-500 ${member === "Kim Minju"
                ? "bg-gradient-to-br from-[#f7c6d9] to-[#f4a7c1] text-white border-transparent shadow-lg shadow-[#f4a7c1]/30 font-bold scale-110 z-10"
                : "glass border-[#f7c6d9]/30 text-[#2a1a20]/60 hover:border-[#f4a7c1]/60 hover:text-[#2a1a20]"
                }`}
            >
              {member}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Discography Section */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-full bg-gradient-to-l from-[#f4a7c1]/40 to-transparent" />
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-3xl font-light whitespace-nowrap">
            Discography
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {initialAlbums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="pb-20">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-3xl font-light whitespace-nowrap">
            Journey Timeline
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-[#f4a7c1]/40 to-transparent" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-[21px] top-0 bottom-0 w-px bg-gradient-to-b from-[#f4a7c1] via-[#f7c6d9] to-transparent" />
          <div className="space-y-12">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="pl-14 relative group"
              >
                <div className="absolute left-0 top-0 w-11 h-11 rounded-full border border-[#f7c6d9]/40 bg-[#fdf7fa] flex items-center justify-center transition-all duration-500 group-hover:border-[#f4a7c1] group-hover:shadow-lg group-hover:shadow-[#f4a7c1]/10">
                  <div className="w-2 h-2 rounded-full bg-[#f4a7c1] group-hover:scale-150 transition-transform" />
                </div>
                <p className="text-[#f4a7c1] text-[10px] font-bold tracking-[0.4em] uppercase mb-2">{m.date}</p>
                <p className="text-[#2a1a20]/80 text-lg font-[family-name:var(--font-noto-serif-kr)] font-light leading-snug group-hover:text-[#2a1a20] transition-colors">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
