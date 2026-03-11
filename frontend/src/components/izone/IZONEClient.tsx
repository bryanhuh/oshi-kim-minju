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
  initialAlbums: Album[];
}

const members = [
  { name: "Kwon Eunbi", hangul: "권은비", flag: "🇰🇷", positions: "Leader · Main Dancer · Lead Vocalist", year: "1995" },
  { name: "Miyawaki Sakura", hangul: "미야와키 사쿠라", flag: "🇯🇵", positions: "Vocalist · Rapper · Visual", year: "1998" },
  { name: "Kang Hyewon", hangul: "강혜원", flag: "🇰🇷", positions: "Lead Rapper · Vocalist · Visual", year: "1999" },
  { name: "Choi Yena", hangul: "최예나", flag: "🇰🇷", positions: "Main Rapper · Lead Vocalist · Lead Dancer", year: "1999" },
  { name: "Lee Chaeyeon", hangul: "이채연", flag: "🇰🇷", positions: "Main Dancer · Lead Vocalist · Lead Rapper", year: "2000" },
  { name: "Kim Chaewon", hangul: "김채원", flag: "🇰🇷", positions: "Lead Vocalist · Lead Dancer", year: "2000" },
  { name: "Kim Minju", hangul: "김민주", flag: "🇰🇷", positions: "Lead Rapper · Vocalist · Visual", year: "2001" },
  { name: "Nako", hangul: "나코", flag: "🇯🇵", positions: "Vocalist", year: "2001" },
  { name: "Hitomi", hangul: "히토미", flag: "🇯🇵", positions: "Lead Dancer · Vocalist · Rapper", year: "2001" },
  { name: "Jo Yuri", hangul: "조유리", flag: "🇰🇷", positions: "Main Vocalist", year: "2001" },
  { name: "Ahn Yujin", hangul: "안유진", flag: "🇰🇷", positions: "Lead Vocalist · Lead Dancer", year: "2003" },
  { name: "Jang Wonyoung", hangul: "장원영", flag: "🇰🇷", positions: "Lead Dancer · Vocalist · Center · Maknae", year: "2004" },
];

const milestones = [
  { date: "2018.08.31", event: "IZ*ONE formed through Produce 48 — a historic collaboration between Mnet and AKB48" },
  { date: "2018.10.29", event: "Official debut with COLOR*IZ and the iconic single 'La Vie en Rose'" },
  { date: "2019.01", event: "Rookie Grand Slam — swept every major Best New Artist award (MAMA, Golden Disc, Seoul Music Awards & more)" },
  { date: "2019.04.01", event: "HEART*IZ — 'Violeta' becomes a massive hit, topping charts worldwide" },
  { date: "2019", event: "Eyes On Me 1st Asia Tour — Seoul, Bangkok, Taipei, Hong Kong, Saitama Super Arena" },
  { date: "2019.11", event: "3-month hiatus following Mnet vote-manipulation investigation" },
  { date: "2020.02.17", event: "BLOOM*IZ — First full studio album breaks all-time first-week girl group sales record (356,313 copies)" },
  { date: "2020.09", event: "Oneiric Theater — first full-scale online concert using AR & VR technology" },
  { date: "2021.03.13", event: "One, The Story — final two-day farewell online concert" },
  { date: "2021.04.29", event: "IZ*ONE officially disbands after their 2.5-year special contract" },
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
          <div className="relative w-full md:w-32 h-44 md:h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
            <Image src={album.coverUrl} alt={album.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>
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
            <button className="text-[10px] text-[#f4a7c1] font-medium uppercase tracking-[0.1em] flex items-center gap-2">
              {isOpen ? "Close Tracks" : "Explore Songs"}
              <motion.span animate={{ x: isOpen ? 0 : 3 }} className="text-lg leading-none">
                {isOpen ? "−" : "→"}
              </motion.span>
            </button>
          </div>
        </div>
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
                    <span className="text-[10px] font-mono text-[#2a1a20]/20 w-4">{i + 1}</span>
                    <p className="flex-1 text-sm text-[#2a1a20]/70 group-hover/track:text-[#2a1a20] transition-colors line-clamp-1">
                      {track.name}
                    </p>
                    <span className="text-[10px] text-[#2a1a20]/30 font-mono">{track.duration}</span>
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

      {/* ── Hero greeting ── */}
      <div className="relative mb-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f7c6d9]/20 blur-[100px] rounded-full -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center"
        >
          <p className="font-[family-name:var(--font-noto-serif-kr)] text-2xl md:text-3xl font-light text-[#2a1a20] italic leading-relaxed max-w-3xl mx-auto">
            &ldquo;Eyes on me! The moment we become one, everyone pays attention! Hello, we are IZ*ONE!&rdquo;
          </p>
          <p className="mt-3 font-[family-name:var(--font-noto-serif-kr)] text-sm text-[#2a1a20]/40 leading-relaxed max-w-3xl mx-auto">
            Eyes on me! 하나가 되는 순간 모두가 주목해! 안녕하세요, 아이즈원입니다!
          </p>
          <p className="mt-6 text-[#f4a7c1] text-[10px] font-bold tracking-[0.6em] uppercase">
            Official IZ*ONE Greeting
          </p>
        </motion.div>
      </div>

      {/* ── About — editorial split layout ── */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-3xl font-light whitespace-nowrap">
            About
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-[#f4a7c1]/40 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0 overflow-hidden rounded-3xl border border-[#f7c6d9]/20 shadow-2xl shadow-[#f4a7c1]/5">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/60 backdrop-blur-sm p-10 md:p-14 flex flex-col justify-center gap-8"
          >
            <div>
              <p className="text-[10px] text-[#f4a7c1] font-bold tracking-[0.35em] uppercase mb-3">Origin</p>
              <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20]/80 text-base font-light leading-relaxed">
                IZ*ONE (아이즈원) was a 12-member South Korean–Japanese project girl group formed through Mnet&apos;s{" "}
                <em>Produce 48</em> — a collaboration between the Produce 101 franchise and Japan&apos;s AKB48.
                Co-managed by Off The Record Entertainment and Swing Entertainment, they held a special 2.5-year
                contract that made every single moment precious beyond words.
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-[#f4a7c1]/30 to-transparent" />

            <div>
              <p className="text-[10px] text-[#f4a7c1] font-bold tracking-[0.35em] uppercase mb-3">Name & Meaning</p>
              <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20]/80 text-base font-light leading-relaxed">
                The name{" "}
                <strong className="text-[#2a1a20] font-medium">IZ*ONE</strong> (pronounced{" "}
                &ldquo;eyes-one&rdquo;) represents 12 members united as one. The asterisk{" "}
                <span className="text-[#f4a7c1] font-semibold">✦</span> symbolises the star-like connection
                between the group and their beloved fandom, <em>WIZ*ONE</em> — together, they shine brightest.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-2xl font-light text-[#e8809e] font-[family-name:var(--font-noto-serif-kr)]">12</p>
                <p className="text-[9px] tracking-[0.25em] text-[#2a1a20]/40 uppercase mt-0.5">Members</p>
              </div>
              <div className="w-px h-8 bg-[#f4a7c1]/20" />
              <div className="text-center">
                <p className="text-2xl font-light text-[#e8809e] font-[family-name:var(--font-noto-serif-kr)]">2.5</p>
                <p className="text-[9px] tracking-[0.25em] text-[#2a1a20]/40 uppercase mt-0.5">Year Journey</p>
              </div>
              <div className="w-px h-8 bg-[#f4a7c1]/20" />
              <div className="text-center">
                <p className="text-2xl font-light text-[#e8809e] font-[family-name:var(--font-noto-serif-kr)]">3</p>
                <p className="text-[9px] tracking-[0.25em] text-[#2a1a20]/40 uppercase mt-0.5">Nations</p>
              </div>
            </div>
          </motion.div>

          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative w-full md:w-[340px] h-72 md:h-auto overflow-hidden"
          >
            <Image
              src="/izone12.jpeg"
              // src="/eyez.jpeg"
              alt="IZ*ONE group photo"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 340px"
            />
            {/* Soft left-fade so it blends into the text panel */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent md:bg-gradient-to-l md:from-white/40 md:via-transparent md:to-transparent" />
            {/* Pretty caption ribbon */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-[#2a1a20]/70 text-[9px] tracking-[0.3em] uppercase px-4 py-2 rounded-full">
                ✦ IZ*ONE ✦
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Members — cute pill/tag style ── */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-full bg-gradient-to-l from-[#f4a7c1]/40 to-transparent" />
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-3xl font-light whitespace-nowrap">
            The Members
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {members.map((member, i) => {
            const isMinju = member.name === "Kim Minju";
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -3, scale: 1.04 }}
                className={`group relative flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl border transition-all duration-300 cursor-default ${isMinju
                  ? "bg-gradient-to-br from-[#f7c6d9] to-[#f4a7c1] border-transparent shadow-lg shadow-[#f4a7c1]/30"
                  : "bg-white/50 border-[#f7c6d9]/30 hover:border-[#f4a7c1]/50 hover:bg-white/70 backdrop-blur-sm"
                  }`}
              >
                {/* Flag + name row */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm leading-none">{member.flag}</span>
                  <p className={`text-xs font-semibold leading-none ${isMinju ? "text-white" : "text-[#2a1a20]"}`}>
                    {member.name}
                  </p>
                  {isMinju && <span className="text-white text-[10px]">♡</span>}
                </div>
                {/* Hangul */}
                <p className={`text-[10px] leading-none ${isMinju ? "text-white/80" : "text-[#2a1a20]/40"}`}>
                  {member.hangul}
                </p>
                {/* Positions tooltip on hover */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-max max-w-[220px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="bg-[#2a1a20]/90 backdrop-blur-sm text-white text-[9px] leading-relaxed tracking-wide px-3 py-1.5 rounded-lg shadow-xl">
                    {member.positions}
                    <br />
                    <span className="text-[#f4a7c1]/70">b. {member.year}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[#2a1a20]/30 text-[10px] tracking-widest uppercase mt-6">
          Hover a name to see their role ✦
        </p>
      </section>

      {/* ── Discography ── */}
      <section className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-3xl font-light whitespace-nowrap">
            Discography
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-[#f4a7c1]/40 to-transparent" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {initialAlbums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </section>

      {/* ── Journey Timeline — cinematic full-width with izone2 hero ── */}
      <section className="pb-20">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-full bg-gradient-to-l from-[#f4a7c1]/40 to-transparent" />
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-3xl font-light whitespace-nowrap">
            Journey Timeline
          </h2>
        </div>

        {/* Full-bleed cinematic hero image banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative w-full rounded-3xl overflow-hidden mb-16 shadow-2xl"
          style={{ height: "440px" }}
        >
          <Image
            src="/izone2.webp"
            alt="IZ*ONE cinematic photo"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Heavy dark→transparent overlay from bottom so text/stars breathe */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0510]/80 via-[#1a0510]/20 to-transparent" />
          {/* Side fades to soften the red BG into the page — kept light so the image shows through */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdf7fa]/30 via-transparent to-[#fdf7fa]/30" />
          {/* Centered quote overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-8 text-center">
            <p className="font-[family-name:var(--font-noto-serif-kr)] text-white/90 text-xl md:text-2xl font-light italic drop-shadow-2xl">
              &ldquo;Every ending is a beginning in disguise.&rdquo;
            </p>
            <p className="mt-2 text-white/40 text-[10px] tracking-[0.4em] uppercase">2018 – 2021</p>
          </div>
        </motion.div>

        {/* Timeline list */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-[21px] top-0 bottom-0 w-px bg-gradient-to-b from-[#f4a7c1] via-[#f7c6d9] to-transparent" />
          <div className="space-y-10">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="pl-14 relative group"
              >
                <div className="absolute left-0 top-0 w-11 h-11 rounded-full border border-[#f7c6d9]/40 bg-[#fdf7fa] flex items-center justify-center transition-all duration-500 group-hover:border-[#f4a7c1] group-hover:shadow-lg group-hover:shadow-[#f4a7c1]/10">
                  <div className="w-2 h-2 rounded-full bg-[#f4a7c1] group-hover:scale-150 transition-transform" />
                </div>
                <p className="text-[#f4a7c1] text-[10px] font-bold tracking-[0.4em] uppercase mb-1.5">{m.date}</p>
                <p className="text-[#2a1a20]/80 text-base font-[family-name:var(--font-noto-serif-kr)] font-light leading-snug group-hover:text-[#2a1a20] transition-colors">
                  {m.event}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
