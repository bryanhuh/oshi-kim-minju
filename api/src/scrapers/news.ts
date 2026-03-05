import * as cheerio from "cheerio";
import { db } from "../db";
import { news } from "../db/schema";

const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search?q=Kim+Minju+%EA%B9%80%EB%AF%BC%EC%A3%BC&hl=ko&gl=KR&ceid=KR:ko";

interface NewsEntry {
  title: string;
  url: string;
  source: string;
  publishedAt: Date | null;
}

export async function scrapeNews(): Promise<void> {
  const res = await fetch(GOOGLE_NEWS_RSS);
  if (!res.ok) throw new Error(`Failed to fetch news RSS: ${res.status}`);

  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const entries: NewsEntry[] = [];

  $("item").each((_, el) => {
    const title = $(el).find("title").text().trim();
    const link = $(el).find("link").text().trim() || $(el).find("link").next().text().trim();
    const source = $(el).find("source").text().trim();
    const pubDateStr = $(el).find("pubDate").text().trim();
    const publishedAt = pubDateStr ? new Date(pubDateStr) : null;

    if (title && link) {
      entries.push({ title, url: link, source, publishedAt });
    }
  });

  if (entries.length === 0) return;

  await db
    .insert(news)
    .values(
      entries.map((e) => ({
        title: e.title,
        source: e.source,
        url: e.url,
        publishedAt: e.publishedAt,
      }))
    )
    .onConflictDoNothing();

  console.log(`[news] Inserted ${entries.length} articles`);
}

// Run directly
if (import.meta.main) {
  scrapeNews().then(() => process.exit(0)).catch(console.error);
}
