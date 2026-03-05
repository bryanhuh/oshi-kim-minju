"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SoundToggle() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = async () => {
    if (loading) return;

    if (!audioRef.current) {
      setLoading(true);
      try {
        const audio = new Audio("/sounds/ambient.mp3");
        audio.loop = true;
        audio.volume = 0.22;
        audioRef.current = audio;
        await audio.play();
        setPlaying(true);
      } catch {
        // file missing or autoplay blocked — silent fail
      } finally {
        setLoading(false);
      }
      return;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      await audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
      title={playing ? "Mute" : "Ambient sound"}
      className="relative w-8 h-8 flex items-center justify-center text-[#2a1a20]/50 hover:text-[#e8809e] transition-colors duration-200"
      whileTap={{ scale: 0.88 }}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full"
        />
      ) : playing ? (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M11 5 6 9H2v6h4l5 4V5z" opacity={0.9} />
          <path
            d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
            stroke="currentColor"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M11 5 6 9H2v6h4l5 4V5z" opacity={0.45} />
          <path
            d="M17 9l6 6M23 9l-6 6"
            stroke="currentColor"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}

      {playing && (
        <motion.div
          className="absolute inset-0 rounded-full border border-[#f4a7c1]/50"
          animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
}
