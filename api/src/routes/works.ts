import { Hono } from "hono";
import { db } from "../db";
import { works } from "../db/schema";
import { desc, eq } from "drizzle-orm";

const worksRoute = new Hono();

worksRoute.get("/", async (c) => {
  const type = c.req.query("type");
  let query = db.select().from(works).orderBy(desc(works.year));
  const results = type
    ? await db.select().from(works).where(eq(works.type, type)).orderBy(desc(works.year))
    : await query;
  return c.json(results);
});

worksRoute.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const result = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return c.json(result[0] ?? null);
});

export default worksRoute;
