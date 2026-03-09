import { Hono } from "hono";
import { db } from "../db/index.js";
import { works } from "../db/schema.js";
import { desc, eq, count } from "drizzle-orm";
import { processHancinemaWorks } from "../scrapers/hancinema.js";

const worksRoute = new Hono();

worksRoute.get("/", async (c) => {
  const type = c.req.query("type");

  try {
    const result = await db.select({ value: count() }).from(works);
    const rowCount = result[0]?.value ?? 0;

    if (Number(rowCount) === 0) {
      console.log("[works] DB empty, please run `bun run download_posters.ts` to seed.");
    }
  } catch (err) {
    console.error("[works] Auto-scrape failed:", err);
  }

  const results = type
    ? await db
      .select()
      .from(works)
      .where(eq(works.type, type))
      .orderBy(desc(works.year))
    : await db.select().from(works).orderBy(desc(works.year));

  return c.json(results);
});

worksRoute.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const result = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return c.json(result[0] ?? null);
});

export default worksRoute;
