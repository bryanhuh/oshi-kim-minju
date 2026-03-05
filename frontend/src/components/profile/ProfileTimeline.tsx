"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "2018",
    title: "Produce 48",
    desc: "Competed on Mnet's Produce 48, finishing in 12th place and debuting with IZ*ONE.",
  },
  {
    year: "2018",
    title: "IZ*ONE Debut",
    desc: "Debuted as a member of IZ*ONE with the mini album COLOR*IZ. Quickly became a fan favorite for her visuals.",
  },
  {
    year: "2019",
    title: "Rising Star",
    desc: "Named a rookie icon by multiple Korean media outlets. Featured on the covers of various fashion magazines.",
  },
  {
    year: "2021",
    title: "IZ*ONE Disbandment",
    desc: "IZ*ONE concluded their activities in April 2021. Minju signed with Kakao Entertainment to pursue acting.",
  },
  {
    year: "2022",
    title: "Acting Debut",
    desc: "Made her acting debut and began building her filmography as a solo actress.",
  },
  {
    year: "2023",
    title: "Breakthrough Roles",
    desc: "Starred in multiple productions, cementing her status as one of the rising actresses in the Korean entertainment industry.",
  },
  {
    year: "2024–",
    title: "Continued Growth",
    desc: "Continues to take on diverse roles in dramas and films, expanding her range as an actress.",
  },
];

export default function ProfileTimeline() {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-xs tracking-[0.4em] mb-4">
          타임라인
        </p>
        <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-3xl font-light text-[#2a1a20]">
          Career Timeline
        </h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#f7c6d9] via-[#f4a7c1] to-transparent" />

        <div className="space-y-12">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-start gap-6 md:gap-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-[#f4a7c1] border-2 border-white -translate-x-1/2 mt-1 shadow-sm pink-glow" />

              {/* Content */}
              <div className={`pl-12 md:pl-0 md:w-5/12 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="glass rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                  <span className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-xs tracking-[0.3em]">
                    {item.year}
                  </span>
                  <h3 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-lg mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#2a1a20]/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
