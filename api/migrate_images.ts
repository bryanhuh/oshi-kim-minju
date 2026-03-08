import { db } from "./src/db";
import { images } from "./src/db/schema";
import { uploadToCloudinary } from "./src/lib/cloudinary";
import { eq } from "drizzle-orm";
import { chromium } from "playwright";

async function migrateImages() {
    console.log("Fetching existing images from DB...");
    const allImages = await db.select().from(images);
    console.log(`Found ${allImages.length} images to migrate.`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    });

    for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        if (!img) continue;

        // Skip if already on Cloudinary
        if (img.url?.includes("cloudinary.com") && (img.thumbnailUrl?.includes("cloudinary.com") || !img.thumbnailUrl)) {
            console.log(`[${i + 1}/${allImages.length}] Already migrated: ${img.id}`);
            continue;
        }

        console.log(`[${i + 1}/${allImages.length}] Migrating: ${img.altText || 'Untitled'} (ID: ${img.id})`);

        try {
            let newUrl = img.url || "";
            let newThumbUrl = img.thumbnailUrl || "";

            const fetchImageWithPlaywright = async (url: string, pId: string, folder: string) => {
                const page = await context.newPage();
                try {
                    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
                    if (response && response.ok()) {
                        const buffer = await response.body();
                        return await uploadToCloudinary(buffer, pId, folder);
                    }
                } catch (e) {
                    console.warn(`    Failed to fetch ${url} via Playwright: ${e}`);
                } finally {
                    await page.close();
                }
                return null;
            };

            // Mirror full image
            if (img.url && !img.url.includes("cloudinary.com")) {
                const publicId = `gallery-${img.id}-${Date.now()}`;
                const cloudUrl = await fetchImageWithPlaywright(img.url, publicId, "minju/gallery");
                if (cloudUrl) {
                    newUrl = cloudUrl;
                    console.log(`  Uploaded full: ${cloudUrl}`);
                }
            }

            // Mirror thumbnail if different
            if (img.thumbnailUrl && !img.thumbnailUrl.includes("cloudinary.com") && img.thumbnailUrl !== img.url) {
                const thumbPublicId = `gallery-${img.id}-thumb-${Date.now()}`;
                const cloudThumbUrl = await fetchImageWithPlaywright(img.thumbnailUrl, thumbPublicId, "minju/gallery");
                if (cloudThumbUrl) {
                    newThumbUrl = cloudThumbUrl;
                    console.log(`  Uploaded thumb: ${cloudThumbUrl}`);
                } else if (newUrl.includes("cloudinary.com")) {
                    newThumbUrl = newUrl; // Fallback to full if thumb fails but full succeeded
                }
            } else if (newUrl.includes("cloudinary.com") && (!img.thumbnailUrl || img.thumbnailUrl === img.url)) {
                newThumbUrl = newUrl;
            }

            // Update DB record if anything changed
            if (newUrl !== img.url || newThumbUrl !== img.thumbnailUrl) {
                await db.update(images)
                    .set({
                        url: newUrl,
                        thumbnailUrl: newThumbUrl,
                    })
                    .where(eq(images.id, img.id));
                console.log(`  Updated DB record.`);
            }

        } catch (err) {
            console.error(`  Failed to migrate image ${img.id}:`, err);
        }

        // Small delay to avoid hammering
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    await browser.close();
    console.log("Migration completed.");
    process.exit(0);
}

migrateImages().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
