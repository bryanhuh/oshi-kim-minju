import { Hono } from "hono";
import { db } from "../db/index.js";
import { minujProfile } from "../db/schema.js";

const profile = new Hono();

profile.get("/", async (c) => {
  const result = await db.select().from(minujProfile).limit(1);
  return c.json(result[0] ?? null);
});

export default profile;
