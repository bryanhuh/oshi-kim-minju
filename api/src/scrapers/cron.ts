import { scrapeNews } from "./news";
import { scrapeHancinemaNews } from "./hancinema-news";
import { scrapeHancinemaImages } from "./hancinema-images";
import { scrapeHancinemaShop } from "./hancinema-shop";
import { scrapeWorks } from "./mydramalist";
import { processHancinemaWorks } from "./hancinema";

async function runAll() {
  console.log("[cron] Starting daily scrape...");

  try {
    await scrapeHancinemaNews();
  } catch (err) {
    console.error("[cron] HanCinema news scrape failed:", err);
  }

  try {
    await scrapeNews();
  } catch (err) {
    console.error("[cron] Google news scrape failed:", err);
  }

  try {
    await scrapeWorks();
  } catch (err) {
    console.error("[cron] Works seed failed:", err);
  }

  try {
    await processHancinemaWorks();
  } catch (err) {
    console.error("[cron] Hancinema works scrape failed:", err);
  }

  try {
    await scrapeHancinemaImages();
  } catch (err) {
    console.error("[cron] Hancinema images scrape failed:", err);
  }

  try {
    await scrapeHancinemaShop();
  } catch (err) {
    console.error("[cron] Hancinema shop scrape failed:", err);
  }

  console.log("[cron] Done.");
}

if (import.meta.main) {
  runAll().then(() => process.exit(0)).catch(console.error);
}
