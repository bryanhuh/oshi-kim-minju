import { Hono } from "hono";
import { db } from "../db";
import { news } from "../db/schema";
import { desc, count } from "drizzle-orm";
import { scrapeNews } from "../scrapers/news";

const newsRoute = new Hono();

newsRoute.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") ?? "20");
  const offset = parseInt(c.req.query("offset") ?? "0");

  try {
    const [{ value: rowCount }] = await db
      .select({ value: count() })
      .from(news);

    if (Number(rowCount) === 0) {
      console.log("[news] DB empty, scraping Google News RSS...");
      await scrapeNews();
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
