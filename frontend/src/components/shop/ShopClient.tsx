"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { ShopItem } from "@/types";

// Fallback items when no data is available
const fallbackItems: ShopItem[] = [
  {
    id: 1,
    title: "Kim Minju Official Photobook",
    description: "Official photobook featuring exclusive behind-the-scenes photos from her drama projects.",
    price: "₩45,000",
    imageUrl: "https://picsum.photos/seed/shop-book1/400/500",
    shopUrl: "https://www.hancinema.net/korean_Kim_Minju-shopping.html",
    category: "Photobook",
    source: "HanCinema",
    createdAt: null,
  },
  {
    id: 2,
    title: "Ask the Stars OST Album",
    description: "Official soundtrack album from the hit ENA drama Ask the Stars.",
    price: "₩18,000",
    imageUrl: "https://picsum.photos/seed/shop-ost1/400/500",
    shopUrl: "https://www.hancinema.net/korean_Kim_Minju-shopping.html",
    category: "Music",
    source: "HanCinema",
    createdAt: null,
  },
  {
    id: 3,
    title: "IZ*ONE BLOOM*IZ Special Album",
    description: "IZ*ONE's third mini album featuring Kim Minju and the group.",
    price: "₩15,000",
    imageUrl: "https://picsum.photos/seed/shop-album1/400/500",
    shopUrl: "https://www.hancinema.net/korean_Kim_Minju-shopping.html",
    category: "Music",
    source: "HanCinema",
    createdAt: null,
  },
  {
    id: 4,
    title: "Connection Drama OST",
    description: "Official soundtrack from the 2024 SBS drama Connection.",
    price: "₩16,000",
    imageUrl: "https://picsum.photos/seed/shop-ost2/400/500",
    shopUrl: "https://www.hancinema.net/korean_Kim_Minju-shopping.html",
    category: "Music",
    source: "HanCinema",
    createdAt: null,
  },
  {
    id: 5,
    title: "Kim Minju Fan Trading Card Set",
    description: "Exclusive set of 12 collectible trading cards featuring Kim Minju.",
    price: "₩22,000",
    imageUrl: "https://picsum.photos/seed/shop-card1/400/500",
    shopUrl: "https://www.hancinema.net/korean_Kim_Minju-shopping.html",
    category: "Merchandise",
    source: "HanCinema",
    createdAt: null,
  },
  {
    id: 6,
    title: "IZ*ONE COLOR*IZ Debut Album",
    description: "IZ*ONE debut mini album COLOR*IZ, featuring Kim Minju.",
    price: "₩14,000",
    imageUrl: "https://picsum.photos/seed/shop-album2/400/500",
    shopUrl: "https://www.hancinema.net/korean_Kim_Minju-shopping.html",
    category: "Music",
    source: "HanCinema",
    createdAt: null,
  },
];

export default function ShopClient({ items }: { items: ShopItem[] }) {
  const displayItems = items.length > 0 ? items : fallbackItems;
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(displayItems.map((i) => i.category).filter(Boolean) as string[]))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? displayItems
    : displayItems.filter((item) => item.category === activeCategory);

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <SectionHeader
        korean="쇼핑"
        title="Shop"
        subtitle="Official merchandise and media featuring Kim Minju"
      />

      {/* Category filter */}
      {categories.length > 1 && (
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm tracking-widest transition-all duration-300 ${activeCategory === cat
                ? "bg-[#f4a7c1] text-white pink-glow"
                : "glass text-[#2a1a20]/60 hover:text-[#e8809e]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-[#2a1a20]/40 py-20 text-sm tracking-widest">
          No items found.
        </p>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <a
                href={item.shopUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                {/* Product card */}
                <div className="glass border border-[#f7c6d9]/30 hover:border-[#f4a7c1]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#f4a7c1]/10">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#fde8f0] to-[#fdf7fa]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-[family-name:var(--font-noto-serif-kr)] text-[#e8809e]/40 text-5xl">
                          쇼
                        </span>
                      </div>
                    )}

                    {/* Category badge */}
                    {item.category && (
                      <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full">
                        <span className="text-[#e8809e] text-xs tracking-widest">{item.category}</span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a20]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                      <span className="text-white text-xs tracking-widest">View in Shop →</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-[family-name:var(--font-noto-serif-kr)] text-[#2a1a20] text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#e8809e] transition-colors duration-300">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-[#2a1a20]/50 text-xs leading-relaxed mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {item.price ? (
                        <span className="font-[family-name:var(--font-noto-serif-kr)] text-[#e8809e] text-sm font-medium">
                          {item.price}
                        </span>
                      ) : (
                        <span className="text-[#2a1a20]/30 text-xs tracking-widest">See price</span>
                      )}
                      <span className="text-[#2a1a20]/30 text-xs">{item.source}</span>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-[#2a1a20]/30 text-xs tracking-widest mt-16"
      >
        Items sourced from HanCinema · Prices may vary
      </motion.p>
    </div>
  );
}
