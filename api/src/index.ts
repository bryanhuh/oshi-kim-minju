import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import profile from "./routes/profile.js";
import works from "./routes/works.js";
import images from "./routes/images.js";
import instagram from "./routes/instagram.js";
import news from "./routes/news.js";
import shop from "./routes/shop.js";
import proxy from "./routes/proxy.js";

import { handle } from "hono/vercel";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    allowMethods: ["GET"],
  })
);

app.route("/api/profile", profile);
app.route("/api/works", works);
app.route("/api/images", images);
app.route("/api/instagram", instagram);
app.route("/api/news", news);
app.route("/api/shop", shop);
app.route("/api/proxy", proxy);

app.get("/health", (c) => c.json({ status: "ok" }));

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
