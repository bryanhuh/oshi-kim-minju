import { scrapeNews } from "./news";
import { scrapeWorks } from "./mydramalist";

async function runAll() {
  console.log("[cron] Starting daily scrape...");

  try {
    await scrapeNews();
  } catch (err) {
    console.error("[cron] News scrape failed:", err);
  }

  try {
    await scrapeWorks();
  } catch (err) {
    console.error("[cron] Works seed failed:", err);
  }

  console.log("[cron] Done.");
}

if (import.meta.main) {
  runAll().then(() => process.exit(0)).catch(console.error);
}
