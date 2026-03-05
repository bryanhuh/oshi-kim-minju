import { pgTable, serial, text, integer, timestamp, varchar, numeric } from "drizzle-orm/pg-core";

export const minujProfile = pgTable("minju_profile", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  nameKorean: varchar("name_korean", { length: 100 }),
  birthdate: varchar("birthdate", { length: 20 }),
  agency: varchar("agency", { length: 100 }),
  bio: text("bio"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const works = pgTable("works", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  titleKorean: varchar("title_korean", { length: 255 }),
  year: integer("year"),
  role: varchar("role", { length: 255 }),
  poster: text("poster"),
  synopsis: text("synopsis"),
  trailerUrl: text("trailer_url"),
  type: varchar("type", { length: 50 }), // drama, movie, variety
  createdAt: timestamp("created_at").defaultNow(),
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: varchar("category", { length: 50 }), // photoshoot, drama_still, event, magazine, instagram
  source: varchar("source", { length: 100 }),
  altText: text("alt_text"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const instagramPosts = pgTable("instagram_posts", {
  id: serial("id").primaryKey(),
  postId: varchar("post_id", { length: 100 }).unique(),
  imageUrl: text("image_url"),
  caption: text("caption"),
  likes: integer("likes"),
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shopItems = pgTable("shop_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: varchar("price", { length: 100 }),
  imageUrl: text("image_url"),
  shopUrl: text("shop_url").unique(),
  category: varchar("category", { length: 100 }),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  source: varchar("source", { length: 100 }),
  url: text("url").unique(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
