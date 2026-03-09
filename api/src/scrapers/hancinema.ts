import * as cheerio from "cheerio";
import { db } from "../db/index.js";
import { works } from "../db/schema.js";
import { mirrorToCloudinary } from "../lib/cloudinary.js";

async function uploadPoster(url: string, title: string): Promise<string> {
    const publicId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    const cloudinaryUrl = await mirrorToCloudinary(url, publicId, "minju/posters");
    return cloudinaryUrl ?? url; // fall back to original URL on failure
}

export interface ScrapedWork {
    title: string;
    titleKorean: string | null;
    year: number | null;
    role: string | null;
    type: string;
    poster?: string;
}

export async function scrapeHancinema(): Promise<ScrapedWork[]> {
    console.log("[hancinema] Fetching Kim Min-ju's page...");
    const res = await fetch("https://www.hancinema.net/korean_Kim_Minju-filmography.html");
    if (!res.ok) {
        throw new Error(`Failed to fetch HanCinema: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const scrapedWorks: ScrapedWork[] = [];
    const addedTitles = new Set<string>(); // to prevent duplicates if any

    // The lists of works are all in <ul class="work_list">
    const uls = $("ul.work_list").toArray();
    for (const ul of uls) {
        const lis = $(ul).find("li").toArray();
        for (const li of lis) {
            const $li = $(li);

            // Title & Korean Title
            const titleA = $li.find(".work_info_short > a").first();
            if (!titleA.length) continue; // Skip if no title

            const titleKorean = titleA.find("span").text().trim();
            const titleStr = titleA.clone().children().remove().end().text().trim();

            // Type and Year (first <p> inside .work_info_short)
            const typeYearP = $li.find(".work_info_short > p").first();
            const typeYearLinks = typeYearP.find("a");
            let type = "drama";
            if (typeYearLinks.length > 0) {
                let typeText = typeYearLinks.eq(0).text().trim().toLowerCase();
                // Normalizing type to match schema (drama, movie, variety)
                if (typeText.includes("movie")) type = "movie";
                else if (typeText.includes("drama") || typeText.includes("sitcom")) type = "drama";
                else type = "variety";
            }
            let year: number | null = null;
            if (typeYearLinks.length > 1) {
                const yearText = typeYearLinks.eq(1).text()?.trim() || "";
                if (yearText) {
                    // E.g. "2026", "2024~2025" -> parse the first 4 digits
                    const match = yearText.match(/^(20\d{2})/);
                    if (match && match[1]) {
                        year = parseInt(match[1], 10);
                    }
                }
            }

            // Role (Character)
            let role: string | null = null;
            // Usually inside <h6 class="credits"><p></p><p><span>Character</span></p><p>Role Name</p></h6>
            const creditsP = $li.find(".work_info_short h6.credits p");
            let foundCharacter = false;
            let foundCast = false;
            creditsP.each((_, p) => {
                const txt = $(p).text().trim();
                if (txt === "Character" || txt === "Cast") {
                    foundCharacter = true;
                } else if (foundCharacter && txt) {
                    role = txt;
                    foundCharacter = false;
                }
            });

            // Poster
            let posterUrl = $li.find(".work_info_short_poster img").attr("src");
            if (posterUrl) {
                if (posterUrl.startsWith("//")) {
                    posterUrl = "https:" + posterUrl;
                } else if (posterUrl.startsWith("/")) {
                    posterUrl = "https://www.hancinema.net" + posterUrl;
                }
            }

            if (titleStr && !addedTitles.has(titleStr)) {
                addedTitles.add(titleStr);
                // Upload poster to Cloudinary if available
                const localPoster = posterUrl ? await uploadPoster(posterUrl, titleStr) : undefined;
                scrapedWorks.push({
                    title: titleStr,
                    titleKorean: titleKorean || null,
                    year,
                    role,
                    type,
                    poster: localPoster || undefined,
                });
            }
        }
    }

    return scrapedWorks;
}

export async function processHancinemaWorks() {
    const worksData = await scrapeHancinema();

    if (worksData.length === 0) {
        console.log("[hancinema] No works found to insert.");
        return worksData;
    }

    console.log(`[hancinema] Found ${worksData.length} works. Inserting to DB...`);

    // Simple insertion with conflict handling 
    // We use onConflictDoNothing to avoid crashing, but drizzle needs a unique constraint to do that properly
    // Since db schema doesn't have a unique constraint on title in `works`, we might need to check manually
    // or just run a manual check then insert only new ones.

    const existingWorks = await db.query.works.findMany({
        columns: {
            title: true,
        }
    });

    const existingTitles = new Set(
        existingWorks
            .filter(w => w.title)
            .map(w => w.title!.toLowerCase().trim())
    );

    const worksToInsert = worksData.filter(w => !existingTitles.has(w.title.toLowerCase().trim()));

    if (worksToInsert.length > 0) {
        await db.insert(works).values(worksToInsert);
        console.log(`[hancinema] Inserted ${worksToInsert.length} new works.`);
    } else {
        console.log("[hancinema] DB is up to date. No new works to insert.");
    }

    return worksData;
}

if (import.meta.main) {
    processHancinemaWorks()
        .then(() => {
            console.log("Scraping completed.");
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
