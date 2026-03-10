import { Hono } from "hono";
import { db } from "../db/index.js";
import { instagramPosts, images } from "../db/schema.js";
import { desc, like } from "drizzle-orm";

const instagramRoute = new Hono();

instagramRoute.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") ?? "30");
  const offset = parseInt(c.req.query("offset") ?? "0");

  const results = await db
    .select()
    .from(instagramPosts)
    .orderBy(desc(instagramPosts.postedAt))
    .limit(limit)
    .offset(offset);

  const postsWithImages = await Promise.all(
    results.map(async (post) => {
      if (!post.postId) return { ...post, images: [] };
      const postImages = await db
        .select()
        .from(images)
        .where(like(images.url, `%/minju/instagram/${post.postId}/%`));

      return {
        ...post,
        images: postImages.map((img) => img.url),
      };
    })
  );

  return c.json(postsWithImages);
});

export default instagramRoute;
