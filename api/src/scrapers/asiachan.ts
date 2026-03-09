import { chromium } from "playwright";
import { db } from "../db";
import { images } from "../db/schema";
import { mirrorToCloudinary } from "../lib/cloudinary";

const BASE_URL = "https://kpop.asiachan.com";
const MINJU_URL = `${BASE_URL}/Kim+Minju`;

interface ScrapedImage {
    url: string;
    thumbnailUrl: string;
    category: "photoshoot" | "drama_still" | "event" | "magazine" | "instagram";
    source: string;
    altText: string;
}

function guessCategoryFromAlt(alt: string): ScrapedImage["category"] {
    const lower = alt.toLowerCase();
    if (lower.includes("drama") || lower.includes("still") || lower.includes("movie")) return "drama_still";
    if (lower.includes("event") || lower.includes("award") || lower.includes("concert")) return "event";
    if (lower.includes("magazine") || lower.includes("vogue") || lower.includes("elle") || lower.includes("cosmo")) return "magazine";
    return "photoshoot";
}

export async function scrapeAsiaChanImages(): Promise<void> {
    console.log("[asiachan-images] Launching browser to fetch Kim Minju gallery...");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
        const response = await page.goto(MINJU_URL, { waitUntil: "domcontentloaded" });
        if (response?.status() === 503) {
            console.warn("[asiachan-images] Encountered 503 error, might be blocked by Cloudflare.");
            return;
        }

        // Wait for the main image grid to be visible
        await page.waitForSelector('#content img', { timeout: 10000 }).catch(() => null);

        // Extract image data
        const scraped = await page.evaluate(() => {
            const results: Array<{ url: string, thumbnailUrl: string, altText: string, pageUrl: string }> = [];
            const imgs = Array.from(document.querySelectorAll('#content img')) as HTMLImageElement[];

            for (let i = 0; i < imgs.length; i++) {
                const img = imgs[i];
                let thumbnailUrl = img.getAttribute('src') || '';

                // Skip UI icons like small.png, medium.png, download.png when they are the primary element
                if (thumbnailUrl.includes('small.png') || thumbnailUrl.includes('medium.png') || thumbnailUrl.includes('download.png') || thumbnailUrl.includes('logo')) {
                    continue;
                }

                const a = img.closest('a');
                if (!a) continue;

                let pageUrl = a.getAttribute('href') || thumbnailUrl;
                const altText = img.getAttribute('alt') || 'Kim Minju';

                // Look ahead for the download.png which contains the high-res link
                let highResUrl = pageUrl;
                let nextImg = imgs[i + 1];
                if (nextImg && nextImg.getAttribute('src')?.includes('download.png')) {
                    const nextA = nextImg.closest('a');
                    if (nextA) {
                        highResUrl = nextA.getAttribute('href') || pageUrl;
                    }
                }

                if (!highResUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
                    highResUrl = thumbnailUrl;
                }

                // Fix URLs
                if (highResUrl.startsWith('//')) highResUrl = 'https:' + highResUrl;
                if (highResUrl.startsWith('/')) highResUrl = 'https://kpop.asiachan.com' + highResUrl;
                if (thumbnailUrl.startsWith('//')) thumbnailUrl = 'https:' + thumbnailUrl;
                if (thumbnailUrl.startsWith('/')) thumbnailUrl = 'https://kpop.asiachan.com' + thumbnailUrl;
                if (pageUrl.startsWith('/')) pageUrl = 'https://kpop.asiachan.com' + pageUrl;

                results.push({ url: highResUrl, thumbnailUrl, altText, pageUrl });
            }
            return results;
        });

        console.log(`[asiachan-images] Found ${scraped.length} images on the page.`);

        if (scraped.length === 0) {
            console.log("[asiachan-images] No images found. Exiting.");
            return;
        }

        const processedScraped: ScrapedImage[] = scraped.map(img => ({
            url: img.url,
            thumbnailUrl: img.thumbnailUrl,
            category: guessCategoryFromAlt(img.altText),
            source: `AsiaChan|${img.pageUrl}`,
            altText: img.altText,
        }));

        // Get existing URLs to avoid duplicates
        const existing = await db.query.images.findMany({ columns: { thumbnailUrl: true, url: true } });
        const existingUrls = new Set([
            ...existing.map((i) => i.thumbnailUrl).filter(Boolean),
            ...existing.map((i) => i.url).filter(Boolean),
        ]);

        const toInsert = processedScraped.filter(
            (img) => !existingUrls.has(img.thumbnailUrl) && !existingUrls.has(img.url)
        );

        if (toInsert.length === 0) {
            console.log("[asiachan-images] No new images to insert.");
            return;
        }

        // Upload images to Cloudinary before inserting
        console.log(`[asiachan-images] Uploading ${toInsert.length} images to Cloudinary...`);
        const cloudinaryImages: typeof processedScraped = [];
        for (let i = 0; i < toInsert.length; i++) {
            const img = toInsert[i];
            try {
                const publicId = `asiachan-${i}-${Date.now()}`;
                const cloudUrl = await mirrorToCloudinary(img.url, publicId, "minju/gallery");
                const cloudThumb = img.thumbnailUrl !== img.url
                    ? await mirrorToCloudinary(img.thumbnailUrl, `${publicId}-thumb`, "minju/gallery")
                    : cloudUrl;

                cloudinaryImages.push({
                    ...img,
                    url: cloudUrl ?? img.url,
                    thumbnailUrl: cloudThumb ?? img.thumbnailUrl,
                } as ScrapedImage);
                console.log(`[asiachan-images] Processed ${i + 1}/${toInsert.length}`);

                if (i > 0 && i % 5 === 0) await new Promise((r) => setTimeout(r, 500));
            } catch (e) {
                console.error(`[asiachan-images] Failed to upload image ${i}:`, e);
                cloudinaryImages.push(img as ScrapedImage);
            }
        }

        await db.insert(images).values(cloudinaryImages);
        console.log(`[asiachan-images] Inserted ${cloudinaryImages.length} new images into the database.`);

    } finally {
        await browser.close();
    }
}

if (import.meta.main) {
    scrapeAsiaChanImages()
        .then(() => {
            console.log("[asiachan-images] Done.");
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
