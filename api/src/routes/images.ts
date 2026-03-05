import { Hono } from "hono";
import { db } from "../db";
import { images } from "../db/schema";
import { desc, eq, count } from "drizzle-orm";
import { scrapeHancinemaImages } from "../scrapers/hancinema-images";

const imagesRoute = new Hono();

imagesRoute.get("/", async (c) => {
  const category = c.req.query("category");
  const limit = parseInt(c.req.query("limit") ?? "50");
  const offset = parseInt(c.req.query("offset") ?? "0");

  try {
    const [{ value: rowCount }] = await db.select({ value: count() }).from(images);
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
