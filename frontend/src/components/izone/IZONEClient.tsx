"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

const discography = [
  { album: "COLOR*IZ", year: 2018, type: "Mini Album", highlight: "Debut" },
  { album: "HEART*IZ", year: 2019, type: "Mini Album", highlight: "La Vie en Rose era" },
  { album: "BLOOM*IZ", year: 2020, type: "Full Album", highlight: "First full album" },
  { album: "ONEIRIC DIARY", year: 2020, type: "Mini Album", highlight: "Most artistic era" },
  { album: "ONE-REELER", year: 2021, type: "Mini Album", highlight: "Final chapter" },
];

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

export default function IZONEClient() {
  return (
    <div className="px-6 max-w-5xl mx-auto">
      <SectionHeader
        korean="아이즈원"
        title="IZ*ONE Era"
        subtitle="2018 – 2021 · A chapter that lives forever in our hearts"
      />

      {/* Hero quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center mb-20"
      >
        <p className="font-[family-name:var(--font-noto-serif-kr)] text-2xl md:text-3xl font-light text-[#2a1a20]/60 leading-relaxed max-w-2xl mx-auto">
          &ldquo;Thank you for making us a constellation&rdquo;
        </p>
        <p className="mt-4 text-[#f4a7c1] text-xs tracking-[0.3em]">IZ*ONE FINAL CONCERT</p>
      </motion.div>

      {/* Members */}
      <section className="mb-20">
        <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-2xl font-light text-center mb-8">
          Members
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {members.map((member, i) => (
            <motion.div
              key={member}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 ${
                member === "Kim Minju"
                  ? "bg-[#f4a7c1] text-white border-[#f4a7c1] pink-glow font-medium"
                  : "glass border-[#f7c6d9]/40 text-[#2a1a20]/70 hover:border-[#f4a7c1]/60"
              }`}
            >
              {member}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Discography */}
      <section className="mb-20">
        <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-2xl font-light text-center mb-8">
          Discography
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discography.map((album, i) => (
            <GlassCard key={album.album} className="p-6" delay={i * 0.1}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-[#f4a7c1] text-xs tracking-widest">{album.year}</span>
                <span className="text-[#2a1a20]/40 text-xs">{album.type}</span>
              </div>
              <h3 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-lg font-light mb-2">
                {album.album}
              </h3>
              <p className="text-[#2a1a20]/50 text-xs tracking-wider">{album.highlight}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-2xl font-light text-center mb-8">
          Key Milestones
        </h2>
        <div className="relative max-w-lg mx-auto">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#f4a7c1] to-transparent" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="pl-10 relative"
              >
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[#f4a7c1] border-2 border-white" />
                <p className="text-[#f4a7c1] text-xs tracking-widest mb-1">{m.date}</p>
                <p className="text-[#2a1a20]/70 text-sm">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
