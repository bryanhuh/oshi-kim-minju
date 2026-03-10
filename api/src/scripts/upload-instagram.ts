import { db } from "../db/index.js";
import { instagramPosts, images } from "../db/schema.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import { eq } from "drizzle-orm";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INSTAGRAM_DIR = path.resolve(__dirname, "../../../minn.__.ju");

async function main() {
    console.log(`[migrate] Starting migration from ${INSTAGRAM_DIR}...`);

    try {
        const entries = await fs.readdir(INSTAGRAM_DIR, { withFileTypes: true });
        const directories = entries
            .filter((e) => e.isDirectory())
            .map((e) => e.name)
            .sort(); // Process in order as requested

        console.log(`[migrate] Found ${directories.length} directories.`);

        for (const dirName of directories) {
            // Parse date and postId
            // Folder format: 2021-07-13_None
            const [datePart] = dirName.split("_");
            const postedAt = new Date(datePart);
            const postId = dirName; // Use the folder name as unique postId

            // Check if already in DB
            const existing = await db.select().from(instagramPosts).where(eq(instagramPosts.postId, postId)).limit(1);
            if (existing.length > 0) {
                console.log(`[migrate] Skipping ${dirName} (already exists)`);
                continue;
            }

            console.log(`[migrate] Processing ${dirName}...`);
            const dirPath = path.join(INSTAGRAM_DIR, dirName);
            const files = await fs.readdir(dirPath);

            // Read caption
            let caption = "";
            if (files.includes("caption.txt")) {
                caption = await fs.readFile(path.join(dirPath, "caption.txt"), "utf-8");
            }

            // Find media files
            const mediaFiles = files.filter((f) =>
                [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov"].includes(
                    path.extname(f).toLowerCase()
                )
            ).sort();

            if (mediaFiles.length === 0) {
                console.warn(`[migrate] No media files found in ${dirName}, skipping.`);
                continue;
            }

            const uploadedUrls: string[] = [];

            for (const file of mediaFiles) {
                const filePath = path.join(dirPath, file);
                const buffer = await fs.readFile(filePath);

                // Create a unique publicId for Cloudinary
                // Format: instagram/2021-07-13_None/01
                const publicId = `${postId}/${path.parse(file).name}`;

                try {
                    const url = await uploadToCloudinary(buffer, publicId, "minju/instagram");
                    uploadedUrls.push(url);
                    console.log(`[migrate] Uploaded ${file} -> ${url}`);

                    // Also insert into 'images' table
                    await db.insert(images).values({
                        url: url,
                        category: "instagram",
                        source: "Instagram",
                        altText: `Instagram post from ${datePart}`,
                    }).onConflictDoNothing();
                } catch (err) {
                    console.error(`[migrate] Failed to upload ${file}:`, err);
                }
            }

            if (uploadedUrls.length > 0) {
                // Insert/Update 'instagram_posts'
                // We use the first uploaded media as the main imageUrl
                await db.insert(instagramPosts).values({
                    postId: postId,
                    imageUrl: uploadedUrls[0],
                    caption: caption,
                    postedAt: postedAt,
                }).onConflictDoUpdate({
                    target: instagramPosts.postId,
                    set: {
                        imageUrl: uploadedUrls[0],
                        caption: caption,
                        postedAt: postedAt,
                    },
                });
                console.log(`[migrate] Updated instagram_posts for ${postId}`);
            }
        }

        console.log("[migrate] Migration completed successfully.");
    } catch (err) {
        console.error("[migrate] Migration failed:", err);
        process.exit(1);
    }
}

main().then(() => process.exit(0));
