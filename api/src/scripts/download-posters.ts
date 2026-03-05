/**
 * Downloads all HanCinema poster images already in the DB to
 * frontend/public/posters/ and updates the poster field to the local path.
 *
 * Run with: bun src/scripts/download-posters.ts
 */

import { db } from "../db";
import { works } from "../db/schema";
import { like, isNotNull } from "drizzle-orm";
import { join, basename } from "path";
import { writeFile, mkdir } from "fs/promises";

// Path to Next.js public/posters relative to api/
const POSTERS_DIR = join(import.meta.dirname, "../../../frontend/public/posters");

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.hancinema.net/",
      },
    });
    if (!res.ok) {
      console.warn(`  [skip] ${url} → HTTP ${res.status}`);
      return null;
    }
    const buf = await res.arrayBuffer();
    return Buffer.from(buf);
  } catch (err) {
    console.warn(`  [error] ${url}:`, err);
    return null;
  }
}

async function run() {
  await mkdir(POSTERS_DIR, { recursive: true });

  // Find all works with a hancinema poster URL
  const allWorks = await db.select().from(works);
  const hancinemaWorks = allWorks.filter(
    (w) => w.poster && w.poster.includes("hancinema.net")
  );

  console.log(`Found ${hancinemaWorks.length} works with HanCinema poster URLs.`);

  for (const work of hancinemaWorks) {
    const url = work.poster!;
    const filename = basename(new URL(url).pathname);
    const localPath = `/posters/${filename}`;
    const filePath = join(POSTERS_DIR, filename);

    // Skip if already downloaded
    try {
      await Bun.file(filePath).text();
      console.log(`  [exists] ${filename}`);
      // Still update DB if still pointing to hancinema
      if (work.poster !== localPath) {
        await db
          .update(works)
          .set({ poster: localPath })
          .where(like(works.poster, `%${filename}%`));
      }
      continue;
    } catch {
      // File doesn't exist, download it
    }

    console.log(`  [download] ${filename}...`);
    const data = await downloadImage(url);

    if (data) {
      await writeFile(filePath, data);
      await db
        .update(works)
        .set({ poster: localPath })
        .where(like(works.poster, `%hancinema.net%`));
      console.log(`  [saved] ${localPath}`);
    }

    // Small delay to be polite
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nDone! Run the frontend server to serve /posters/* images.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
