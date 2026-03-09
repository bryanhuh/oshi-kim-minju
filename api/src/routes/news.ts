import { Hono } from "hono";
import { db } from "../db/index.js";
import { news } from "../db/schema.js";
import { desc, count } from "drizzle-orm";
import { scrapeNews } from "../scrapers/news.js";
import { scrapeHancinemaNews } from "../scrapers/hancinema-news.js";

const newsRoute = new Hono();

newsRoute.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") ?? "20");
  const offset = parseInt(c.req.query("offset") ?? "0");

  try {
    const result = await db.select({ value: count() }).from(news);
    const rowCount = result[0]?.value ?? 0;

    if (Number(rowCount) === 0) {
      console.log("[news] DB empty, scraping HanCinema + Google News RSS...");
      await scrapeHancinemaNews().catch((e) =>
        console.error("[news] HanCinema news scrape failed:", e)
      );
      await scrapeNews().catch((e) =>
        console.error("[news] Google RSS scrape failed:", e)
      );
    }
  } catch (err) {
    console.error("[news] Auto-scrape failed:", err);
  }

  const results = await db
    .select()
    .from(news)
    .orderBy(desc(news.publishedAt))
    .limit(limit)
    .offset(offset);

  return c.json(results);
});

export default newsRoute;
