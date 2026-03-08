import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import profile from "./routes/profile";
import works from "./routes/works";
import images from "./routes/images";
import instagram from "./routes/instagram";
import news from "./routes/news";
import shop from "./routes/shop";
import proxy from "./routes/proxy";

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

export default {
  port: parseInt(process.env.PORT ?? "3001"),
  fetch: app.fetch,
};
