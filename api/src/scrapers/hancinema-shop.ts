import * as cheerio from "cheerio";
import { db } from "../db";
import { shopItems } from "../db/schema";
import { mirrorToCloudinary } from "../lib/cloudinary";

const BASE_URL = "https://www.hancinema.net";
const SHOP_URL = `${BASE_URL}/korean_Kim_Minju-shopping.html`;

interface ScrapedShopItem {
  title: string;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
  shopUrl: string | null;
  category: string | null;
  source: string;
}

function resolveUrl(href: string): string {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return "https:" + href;
  return BASE_URL + (href.startsWith("/") ? "" : "/") + href;
}

export async function scrapeHancinemaShop(): Promise<void> {
  console.log("[hancinema-shop] Fetching Kim Minju shopping page...");

  const res = await fetch(SHOP_URL);

  if (!res.ok) {
    throw new Error(`[hancinema-shop] Failed to fetch: HTTP ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const scraped: ScrapedShopItem[] = [];
  const seenUrls = new Set<string>();

  // HanCinema shopping page lists products with links, images, and price info
  // Common patterns: ul.shop_list li, div.product, .shopping_item
  $("li, .product, .item, article").each((_, el) => {
    const $el = $(el);
    const link = $el.find("a[href]").first();
    if (!link.length) return;

    const href = link.attr("href") ?? "";
    if (!href || href === "#") return;

    const shopUrl = resolveUrl(href);
    if (seenUrls.has(shopUrl)) return;

    // Skip internal navigation links
    if (shopUrl.includes("_Kim_Minju") && !shopUrl.includes("shopping")) return;

    const img = $el.find("img").first();
    const imgSrc = img.attr("src") ?? img.attr("data-src") ?? "";
    if (!imgSrc.match(/\.(jpg|jpeg|png|webp)/i) && !imgSrc.includes("product")) return;

    const title =
      $el.find("h2, h3, h4, .title, .name, .product-name").first().text().trim() ||
      link.attr("title")?.trim() ||
      img.attr("alt")?.trim() ||
      "";

    if (!title || title.length < 3) return;

    const price =
      $el.find(".price, [class*='price'], .cost").first().text().trim() || null;

    const description =
      $el.find("p, .desc, .description").first().text().trim().slice(0, 300) || null;

    const category =
      $el.find(".category, .type, [class*='category']").first().text().trim() || null;

    seenUrls.add(shopUrl);
    scraped.push({
      title,
      description,
      price,
      imageUrl: imgSrc ? resolveUrl(imgSrc) : null,
      shopUrl,
      category,
      source: "HanCinema",
    });
  });

  if (scraped.length === 0) {
    console.log("[hancinema-shop] No shop items found (page may be blocked or empty).");
    return;
  }

  // Upload shop images to Cloudinary
  console.log(`[hancinema-shop] Uploading ${scraped.length} images to Cloudinary...`);
  for (let i = 0; i < scraped.length; i++) {
    const item = scraped[i];
    if (!item) continue;
    if (item.imageUrl) {
      const publicId = `shop-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50)}`;
      const cloudUrl = await mirrorToCloudinary(item.imageUrl, publicId, "minju/shop");
      if (cloudUrl) item.imageUrl = cloudUrl;
    }
    if (i > 0 && i % 5 === 0) await new Promise((r) => setTimeout(r, 500));
  }

  await db
    .insert(shopItems)
    .values(scraped)
    .onConflictDoNothing();

  console.log(`[hancinema-shop] Inserted up to ${scraped.length} shop items.`);
}

if (import.meta.main) {
  scrapeHancinemaShop()
    .then(() => {
      console.log("[hancinema-shop] Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
