import * as cheerio from "cheerio";
import { db } from "../db";
import { images } from "../db/schema";
import { mirrorToCloudinary } from "../lib/cloudinary";

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

  const res = await fetch(GALLERY_URL);

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

  // Upload images to Cloudinary before inserting
  console.log(`[hancinema-images] Uploading ${toInsert.length} images to Cloudinary...`);
  const cloudinaryImages = [];
  for (let i = 0; i < toInsert.length; i++) {
    const img = toInsert[i];
    const publicId = `gallery-${i}-${Date.now()}`;
    const cloudUrl = await mirrorToCloudinary(img.url, publicId, "minju/gallery");
    const cloudThumb = img.thumbnailUrl !== img.url
      ? await mirrorToCloudinary(img.thumbnailUrl, `${publicId}-thumb`, "minju/gallery")
      : cloudUrl;

    cloudinaryImages.push({
      ...img,
      url: cloudUrl ?? img.url,
      thumbnailUrl: cloudThumb ?? img.thumbnailUrl,
    });

    // Small delay to avoid rate limiting
    if (i > 0 && i % 5 === 0) await new Promise((r) => setTimeout(r, 500));
  }

  await db.insert(images).values(cloudinaryImages);
  console.log(`[hancinema-images] Inserted ${cloudinaryImages.length} new images.`);
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
