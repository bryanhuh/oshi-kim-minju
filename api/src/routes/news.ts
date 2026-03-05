import { Hono } from "hono";
import { db } from "../db";
import { news } from "../db/schema";
import { desc } from "drizzle-orm";

const newsRoute = new Hono();

newsRoute.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") ?? "20");
  const offset = parseInt(c.req.query("offset") ?? "0");

  const results = await db
    .select()
    .from(news)
    .orderBy(desc(news.publishedAt))
    .limit(limit)
    .offset(offset);

  return c.json(results);
});

export default newsRoute;
