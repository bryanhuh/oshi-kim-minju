import { Hono } from "hono";
import { db } from "../db";
import { shopItems } from "../db/schema";
import { desc, count } from "drizzle-orm";
import { scrapeHancinemaShop } from "../scrapers/hancinema-shop";

const shopRoute = new Hono();

shopRoute.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") ?? "50");
  const offset = parseInt(c.req.query("offset") ?? "0");

  try {
    const [{ value: rowCount }] = await db.select({ value: count() }).from(shopItems);
    if (Number(rowCount) === 0) {
      console.log("[shop] DB empty, scraping HanCinema shop...");
      await scrapeHancinemaShop();
    }
  } catch (err) {
    console.error("[shop] Auto-scrape failed:", err);
  }

  const results = await db
    .select()
    .from(shopItems)
    .orderBy(desc(shopItems.createdAt))
    .limit(limit)
    .offset(offset);

  return c.json(results);
});

export default shopRoute;
