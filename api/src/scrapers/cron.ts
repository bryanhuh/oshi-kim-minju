import { scrapeNews } from "./news";
import { scrapeDramaList } from "./mydramalist";

async function runAll() {
  console.log("[cron] Starting daily scrape...");

  try {
    await scrapeNews();
  } catch (err) {
    console.error("[cron] News scrape failed:", err);
  }

  try {
    await scrapeDramaList();
  } catch (err) {
    console.error("[cron] DramaList scrape failed:", err);
  }

  console.log("[cron] Done.");
}

if (import.meta.main) {
  runAll().then(() => process.exit(0)).catch(console.error);
}
