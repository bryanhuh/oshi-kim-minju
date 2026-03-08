"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const sections = [
  {
    href: "/profile",
    korean: "프로필",
    title: "Her Story",
    desc: "Biography, career timeline, and achievements of Kim Minju.",
    gradient: "from-[#f7c6d9] to-[#fde8f0]",
  },
  {
    href: "/dramas",
    korean: "드라마",
    title: "Dramas & Films",
    desc: "All of Minju's acting works — dramas, films, and variety shows.",
    gradient: "from-[#f4a7c1] to-[#f7c6d9]",
  },
  {
    href: "/gallery",
    korean: "갤러리",
    title: "Gallery",
    desc: "Photoshoots, magazine covers, and event photos.",
    gradient: "from-[#e8809e] to-[#f4a7c1]",
  },
  {
    href: "/instagram",
    korean: "인스타그램",
    title: "Instagram",
    desc: "A polaroid archive of Minju's Instagram moments.",
    gradient: "from-[#f4a7c1] to-[#e8809e]",
  },
  {
    href: "/izone",
    korean: "아이즈원",
    title: "IZ*ONE Era",
    desc: "A tribute to her journey with IZ*ONE.",
    gradient: "from-[#fde8f0] to-[#f7c6d9]",
  },
];

export default function HomeTeaser() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader
        korean="세계를 탐험하다"
        title="Explore Her World"
        subtitle="Navigate through each chapter of Minju's story"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={section.href} className="block group">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] glass border border-[#f7c6d9]/30 hover:border-[#f4a7c1]/50 transition-all duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <span className="font-[family-name:var(--font-noto-serif-kr)] text-[#e8809e]/70 text-xs tracking-[0.3em]">
                    {section.korean}
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-2xl font-light mb-2 group-hover:text-[#e8809e] transition-colors duration-300">
                      {section.title}
                    </h3>
                    <p className="text-[#2a1a20]/50 text-sm leading-relaxed">{section.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-[#e8809e] text-xs tracking-widest">
                      <span>Explore</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
