"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const bioData = {
  name: "Kim Minju",
  nameKorean: "김민주",
  birthdate: "February 5, 2001",
  birthplace: "Daejeon, South Korea",
  agency: "Kakao Entertainment",
  height: "168 cm",
  blood: "O",
  education: "Hanlim Multi Art School",
};

const infoItems = [
  { label: "Born", value: bioData.birthdate },
  { label: "Birthplace", value: bioData.birthplace },
  { label: "Agency", value: bioData.agency },
  { label: "Height", value: bioData.height },
  { label: "Blood Type", value: bioData.blood },
  { label: "Education", value: bioData.education },
];

export default function ProfileBio() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-xs tracking-[0.4em] mb-4">
            BIOGRAPHY
          </p>
          <h2 className="font-[family-name:var(--font-noto-serif-kr)] text-3xl font-light text-[#2a1a20] mb-6">
            Her Story
          </h2>
          <div className="space-y-4 text-[#2a1a20]/70 leading-relaxed">
            <p>
              Kim Minju (김민주) is a South Korean actress and model, born on February 5, 2001 in Daejeon. She rose to fame as a member of the K-pop group IZ*ONE, formed through the reality competition show <em>Produce 48</em> in 2018.
            </p>
            <p>
              After IZ*ONE&apos;s disbandment in 2021, Minju transitioned into acting, quickly establishing herself as one of Korea&apos;s most promising young actresses. Her ethereal beauty and natural charisma have made her a sought-after face for luxury brands and magazine covers.
            </p>
            <p>
              Known for her delicate features and warm personality, she continues to expand her career across dramas, films, and modeling.
            </p>
          </div>
        </motion.div>

        <GlassCard className="p-8" delay={0.2}>
          <div className="grid grid-cols-1 gap-4">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex justify-between items-center py-3 border-b border-[#f7c6d9]/30 last:border-0"
              >
                <span className="text-[#2a1a20]/40 text-xs tracking-widest">{item.label}</span>
                <span className="text-[#2a1a20] text-sm">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
