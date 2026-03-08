"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import FloatingAura from "@/components/ui/FloatingAura";
import { useRef, useState, useEffect } from "react";

export default function ProfileHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effects for scroll
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Mouse move parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      springX.set(x);
      springY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fdf7fa]">
      {/* 3D Background Layer */}
      <FloatingAura />

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,167,193,0.08)_0%,transparent_70%)]" />

      {/* Decorative circles and integrated image */}
      <motion.div
        style={{ x: springX, y: springY, opacity, scale }}
        className="relative flex items-center justify-center w-[600px] h-[600px] pointer-events-none"
      >
        {/* Outer Circle - slow rotation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-[#f7c6d9]/30"
        />

        {/* Middle Circle - opposite rotation */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[15%] rounded-full border border-[#f4a7c1]/20 border-dashed"
        />

        {/* Inner Circle with Image */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-full p-2 bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center overflow-hidden shadow-2xl shadow-[#f4a7c1]/10 pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full rounded-full overflow-hidden"
          >
            <Image
              src="/oshi.webp"
              alt="Kim Minju"
              fill
              className="object-cover scale-110"
              priority
            />
            {/* Soft inner glow overlay */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(253,232,240,0.4)]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Title text - Floating with parallax */}
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-12 right-8 md:bottom-20 md:right-24 z-20 text-right"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="font-[family-name:var(--font-noto-serif-kr)] text-[#f4a7c1] text-xs font-bold tracking-[0.6em] mb-4 uppercase">
            Official Profile
          </p>

          <h1 className="font-[family-name:var(--font-noto-serif-kr)] text-5xl md:text-8xl font-light text-[#2a1a20] tracking-tighter mb-4 leading-none">
            Kim <span className="italic font-extralight text-[#f4a7c1]">Minju</span>
          </h1>

          <div className="flex items-center justify-end gap-6 mb-8">
            <span className="h-px w-12 bg-[#f4a7c1]/30" />
            <p className="font-[family-name:var(--font-noto-serif-kr)] text-xl md:text-2xl text-[#2a1a20]/40 tracking-[0.4em]">
              김민주
            </p>
          </div>
        </motion.div>

        {/* Dynamic accent line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
          className="h-0.5 bg-gradient-to-l from-[#f4a7c1] via-[#f7c6d9] to-transparent"
        />
      </motion.div>

      {/* Left side decorative text */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/2 left-8 md:left-20 -translate-y-1/2 hidden lg:block"
      >
        <div className="rotate-90 origin-left">
          <p className="text-[10px] tracking-[1em] uppercase text-[#2a1a20]/10 font-bold whitespace-nowrap">
            Est. 2001 — Seoul, South Korea
          </p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
      >
        <div className="w-px h-12 bg-gradient-to-b from-[#f4a7c1] to-transparent" />
        <span className="text-[9px] tracking-[0.4em] uppercase text-[#2a1a20]">Scroll</span>
      </motion.div>
    </section>
  );
}
