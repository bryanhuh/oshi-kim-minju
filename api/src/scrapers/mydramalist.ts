import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { db } from "../db";
import { works } from "../db/schema";

const MDL_URL = "https://mydramalist.com/people/16079-kim-minju";

export async function scrapeDramaList(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(MDL_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector(".film-title", { timeout: 10000 }).catch(() => {});

    const html = await page.content();
    const $ = cheerio.load(html);

    const entries: Array<{
      title: string;
      titleKorean: string | null;
      year: number | null;
      role: string | null;
      type: string;
    }> = [];

    $(".film-detail").each((_, el) => {
      const title = $(el).find(".film-title a").text().trim();
      const year = parseInt($(el).find(".film-meta .year").text().trim()) || null;
      const role = $(el).find(".film-meta .role").text().trim() || null;
      const type = $(el).closest(".tab-pane").attr("id") ?? "drama";

      if (title) {
        entries.push({ title, titleKorean: null, year, role, type });
      }
    });

    if (entries.length > 0) {
      await db.insert(works).values(entries).onConflictDoNothing();
      console.log(`[mydramalist] Inserted ${entries.length} works`);
    }
  } finally {
    await browser.close();
  }
}

if (import.meta.main) {
  scrapeDramaList().then(() => process.exit(0)).catch(console.error);
}
