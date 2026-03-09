import { Hono } from "hono";
import { db } from "../db/index.js";
import { images } from "../db/schema.js";
import { desc, eq, count } from "drizzle-orm";
import { scrapeHancinemaImages } from "../scrapers/hancinema-images.js";

const imagesRoute = new Hono();

imagesRoute.get("/", async (c) => {
  const category = c.req.query("category");
  const limit = parseInt(c.req.query("limit") ?? "50");
  const offset = parseInt(c.req.query("offset") ?? "0");

  try {
    const result = await db.select({ value: count() }).from(images);
    const rowCount = result[0]?.value ?? 0;
    if (Number(rowCount) === 0) {
      console.log("[images] DB empty, scraping HanCinema gallery...");
      await scrapeHancinemaImages();
    }
  } catch (err) {
    console.error("[images] Auto-scrape failed:", err);
  }

  const results = category
    ? await db.select().from(images).where(eq(images.category, category)).orderBy(desc(images.uploadedAt)).limit(limit).offset(offset)
    : await db.select().from(images).orderBy(desc(images.uploadedAt)).limit(limit).offset(offset);

  return c.json(results);
});

export default imagesRoute;
