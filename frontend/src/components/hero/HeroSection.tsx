"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroOverlay from "./HeroOverlay";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#fde8f0] via-[#fdf0f5] to-[#fdf7fa]" />
  ),
});

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene scrollY={scrollY} />
      </div>
      <HeroOverlay />
    </section>
  );
}
