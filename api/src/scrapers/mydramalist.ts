import { db } from "../db/index.js";
import { works } from "../db/schema.js";

export interface ScrapedWork {
  title: string;
  titleKorean: string | null;
  year: number | null;
  role: string | null;
  type: string;
}

// MyDramaList is behind Cloudflare; use a curated static seed instead.
const KIM_MINJU_WORKS: ScrapedWork[] = [
  // Dramas
  {
    title: "Crash Course in Romance",
    titleKorean: "일타 스캔들",
    year: 2023,
    role: "Lee Seo-ha",
    type: "drama",
  },
  {
    title: "Young Lady and Gentleman",
    titleKorean: "신사와 아가씨",
    year: 2021,
    role: "Park Sun-hye",
    type: "drama",
  },
  {
    title: "Idol: The Coup",
    titleKorean: "아이돌: 더 쿠프",
    year: 2021,
    role: "Cha Soo-ah",
    type: "drama",
  },
  {
    title: "The Golden Spoon",
    titleKorean: "금수저",
    year: 2022,
    role: "Na Joo-hee",
    type: "drama",
  },
  // Movies
  {
    title: "More Than Family",
    titleKorean: "찬실이는 복도 많지",
    year: 2020,
    role: "Kim Jin-a",
    type: "movie",
  },
  // Variety
  {
    title: "IZ*ONE CHU",
    titleKorean: "아이즈원츄",
    year: 2018,
    role: "Herself",
    type: "variety",
  },
  {
    title: "Celeb Five: Behind the Universe",
    titleKorean: "셀럽파이브: 비하인드 더 유니버스",
    year: 2021,
    role: "Herself",
    type: "variety",
  },
];

export async function scrapeWorks(): Promise<ScrapedWork[]> {
  await db.insert(works).values(KIM_MINJU_WORKS).onConflictDoNothing();
  console.log(`[works] Seeded ${KIM_MINJU_WORKS.length} works`);
  return KIM_MINJU_WORKS;
}

// Kept for backward compatibility — news route now uses scrapers/news.ts instead
export async function scrapeArticles() {
  return [];
}

if (import.meta.main) {
  const w = await scrapeWorks();
  console.log(`Seeded ${w.length} works`);
  process.exit(0);
}
