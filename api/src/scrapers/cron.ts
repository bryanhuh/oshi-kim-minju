import { scrapeNews } from "./news.js";
import { scrapeHancinemaNews } from "./hancinema-news.js";
import { scrapeHancinemaImages } from "./hancinema-images.js";
import { scrapeHancinemaShop } from "./hancinema-shop.js";
import { scrapeWorks } from "./mydramalist.js";
import { processHancinemaWorks } from "./hancinema.js";

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
