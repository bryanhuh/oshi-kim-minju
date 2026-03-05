"use client";

import { motion } from "framer-motion";

const facts = [
  "She was scouted by a talent agency while in middle school.",
  "Her nickname is '미녀' (Beauty) among fans.",
  "She is known for her love of cats.",
  'Voted "Most Memorable Face" by multiple K-media outlets.',
  "She was the visual center of IZ*ONE.",
  "Her fans are called '민주주의자' (Minjuist).",
  "She enjoys painting and drawing in her free time.",
  "Known for her bright smile and warm personality backstage.",
];

export default function ProfileFacts() {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-xs tracking-[0.4em] mb-4">
          재미있는 사실
        </p>
        <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-3xl font-light text-[#2a1a20]">
          Fun Facts
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {facts.map((fact, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="glass rounded-xl p-5 flex items-start gap-3 hover:border-[#f4a7c1]/40 transition-colors duration-300 border border-transparent"
          >
            <span className="text-[#f4a7c1] text-lg mt-0.5">✦</span>
            <p className="text-[#2a1a20]/70 text-sm leading-relaxed">{fact}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
