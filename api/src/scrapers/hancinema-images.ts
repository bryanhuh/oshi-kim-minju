import * as cheerio from "cheerio";
import { db } from "../db";
import { images } from "../db/schema";

const BASE_URL = "https://www.hancinema.net";
const GALLERY_URL = `${BASE_URL}/korean_Kim_Minju-picture_gallery.html`;

interface ScrapedImage {
  url: string;
  thumbnailUrl: string;
  category: "photoshoot" | "drama_still" | "event" | "magazine" | "instagram";
  source: string;
  altText: string;
}

function resolveUrl(href: string): string {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return "https:" + href;
  return BASE_URL + (href.startsWith("/") ? "" : "/") + href;
}

function guessCategoryFromAlt(alt: string): ScrapedImage["category"] {
  const lower = alt.toLowerCase();
  if (lower.includes("drama") || lower.includes("still") || lower.includes("movie")) return "drama_still";
  if (lower.includes("event") || lower.includes("award") || lower.includes("concert")) return "event";
  if (lower.includes("magazine") || lower.includes("vogue") || lower.includes("elle") || lower.includes("cosmo")) return "magazine";
  return "photoshoot";
}

export async function scrapeHancinemaImages(): Promise<void> {
  console.log("[hancinema-images] Fetching Kim Minju picture gallery...");

  const res = await fetch(GALLERY_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`[hancinema-images] Failed to fetch: HTTP ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const scraped: ScrapedImage[] = [];
  const seenUrls = new Set<string>();

  // HanCinema picture gallery: images wrapped in anchor tags
  // Thumbnails are <img> inside <a href="full-size-url">
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const img = $(el).find("img").first();
    if (!img.length) return;

    const imgSrc = img.attr("src") ?? img.attr("data-src") ?? "";
    if (!imgSrc) return;

    // Skip icons and tiny images
    if (imgSrc.includes("icon") || imgSrc.includes("logo") || imgSrc.includes("ad")) return;
    // Only grab actual photo URLs (not navigation or avatar images)
    if (!imgSrc.match(/\.(jpg|jpeg|png|webp)/i)) return;

    const thumbnailUrl = resolveUrl(imgSrc);
    // Full URL: could be the href (if it points to an image) or derived from thumbnail
    const fullUrl = href.match(/\.(jpg|jpeg|png|webp)/i)
      ? resolveUrl(href)
      : thumbnailUrl.replace(/(_t|_thumb|_small|_200|_300|_400)/i, "");

    if (seenUrls.has(thumbnailUrl)) return;
    seenUrls.add(thumbnailUrl);

    const altText = img.attr("alt")?.trim() ?? "Kim Minju";
    const category = guessCategoryFromAlt(altText);

    scraped.push({
      url: fullUrl || thumbnailUrl,
      thumbnailUrl,
      category,
      source: "HanCinema",
      altText,
    });
  });

  if (scraped.length === 0) {
    console.log("[hancinema-images] No images found (page may be blocked or empty).");
    return;
  }

  // Get existing URLs to avoid duplicates
  const existing = await db.query.images.findMany({ columns: { thumbnailUrl: true, url: true } });
  const existingUrls = new Set([
    ...existing.map((i) => i.thumbnailUrl).filter(Boolean),
    ...existing.map((i) => i.url).filter(Boolean),
  ]);

  const toInsert = scraped.filter(
    (img) => !existingUrls.has(img.thumbnailUrl) && !existingUrls.has(img.url)
  );

  if (toInsert.length === 0) {
    console.log("[hancinema-images] No new images to insert.");
    return;
  }

  await db.insert(images).values(toInsert);
  console.log(`[hancinema-images] Inserted ${toInsert.length} new images.`);
}

if (import.meta.main) {
  scrapeHancinemaImages()
    .then(() => {
      console.log("[hancinema-images] Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
