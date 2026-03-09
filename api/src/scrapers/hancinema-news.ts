import * as cheerio from "cheerio";
import { db } from "../db/index.js";
import { news } from "../db/schema.js";

const BASE_URL = "https://www.hancinema.net";
const NEWS_URL = `${BASE_URL}/korean_Kim_Minju-news.html`;

interface NewsEntry {
  title: string;
  url: string;
  source: string;
  publishedAt: Date | null;
}

export async function scrapeHancinemaNews(): Promise<void> {
  console.log("[hancinema-news] Fetching Kim Minju news page...");

  const res = await fetch(NEWS_URL);

  if (!res.ok) {
    throw new Error(`[hancinema-news] Failed to fetch: HTTP ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const entries: NewsEntry[] = [];

  // HanCinema news page typically lists articles as anchor tags linking to article pages
  // Pattern: /article-title-NNNNN.html
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    // HanCinema articles have numeric IDs at the end of their URL
    if (!href.match(/\/[\w-]+-\d{4,}\.html$/)) return;

    const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;
    // Skip if it's the same person page or category pages
    if (fullUrl.includes("_Kim_Minju")) return;

    const title = $(el).text().trim();
    if (!title || title.length < 5) return;

    // Look for date nearby — in parent or sibling elements
    const parent = $(el).closest("li, div, article");
    const dateText =
      parent.find(".date, .pub_date, time, [class*='date']").first().text().trim() ||
      parent.text().match(/\d{4}[-./]\d{2}[-./]\d{2}/)?.[0] ||
      "";

    let publishedAt: Date | null = null;
    if (dateText) {
      const normalized = dateText.replace(/\./g, "-");
      const d = new Date(normalized);
      if (!isNaN(d.getTime())) publishedAt = d;
    }

    entries.push({
      title,
      url: fullUrl,
      source: "HanCinema",
      publishedAt,
    });
  });

  if (entries.length === 0) {
    console.log("[hancinema-news] No news found (page may be blocked or empty).");
    return;
  }

  // Deduplicate by URL
  const unique = entries.filter(
    (e, i, arr) => arr.findIndex((x) => x.url === e.url) === i
  );

  await db
    .insert(news)
    .values(
      unique.map((e) => ({
        title: e.title,
        source: e.source,
        url: e.url,
        publishedAt: e.publishedAt,
      }))
    )
    .onConflictDoNothing();

  console.log(`[hancinema-news] Inserted up to ${unique.length} news articles.`);
}

if (import.meta.main) {
  scrapeHancinemaNews()
    .then(() => {
      console.log("[hancinema-news] Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
