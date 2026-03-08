import { mkdir } from "fs/promises";
import { join } from "path";
import { db } from "./src/db";
import { works } from "./src/db/schema";

const POSTERS_DIR = join(import.meta.dirname, "../frontend/public/posters");

const WORKS_TO_SEED = [
    {
        title: "Produce 48",
        titleKorean: "프로듀스 48",
        year: 2018,
        role: "Contestant (12th place)",
        posterUrl: "https://image.tmdb.org/t/p/w500/8TYdsYkv91NnPvTTOezLiv2I4xg.jpg",
        synopsis: "A collaboration survival show between Mnet and AKB48. 96 Korean and Japanese trainees compete for 12 debut spots in a new group. Minju finished in 12th place, debuting as a member of IZ*ONE.",
        type: "variety",
    },
    {
        title: "Welcome to Waikiki 2",
        titleKorean: "으라차차 와이키키 2",
        year: 2019,
        role: "Han Yoon-ah",
        posterUrl: null, // No verified poster right now
        synopsis: "The second season of the romantic comedy series about three dreamers running a guesthouse in Itaewon, Seoul.",
        type: "drama",
    },
    {
        title: "IZ*ONE Chu",
        titleKorean: "아이즈원츄",
        year: 2018,
        role: "Herself",
        posterUrl: null,
        synopsis: "A reality web series documenting the daily lives and activities of IZ*ONE members.",
        type: "variety",
    },
    {
        title: "Trolley",
        titleKorean: "트롤리",
        year: 2022,
        role: "Kim Soo-bin",
        posterUrl: "https://image.tmdb.org/t/p/w500/pdOiUbJ0vEJfh5OGFG8y1e4InQ7.jpg",
        synopsis: "A politician's wife with a dark secret is thrust into a moral dilemma. Kim Soo-bin is a high school student whose life becomes entangled in a political scandal that tears families apart.",
        type: "drama",
    },
    {
        title: "Ask the Stars",
        titleKorean: "별에게 물어봐",
        year: 2023,
        role: "Oh Bok-soon",
        posterUrl: "https://image.tmdb.org/t/p/w500/6VAaqoJJtrOplC9LvN4Dg0nqfFr.jpg",
        synopsis: "A romantic comedy set aboard the first commercial space station. Oh Bok-soon is a spirited crew member who falls in love with a surgeon who boards the station.",
        type: "drama",
    },
    {
        title: "The Midnight Studio",
        titleKorean: "심야화실",
        year: 2024,
        role: "Hong Ye-seul",
        posterUrl: null, // No verified poster right now
        synopsis: "A mysterious midnight art studio draws in a young art student, Hong Ye-seul, who encounters a reclusive painter and uncovers the secrets hidden within his work.",
        type: "drama",
    },
];

async function downloadPostersAndSeed() {
    await mkdir(POSTERS_DIR, { recursive: true });

    console.log("Emptying existing works from DB...");
    await db.delete(works);

    const seededWorks = [];

    for (const work of WORKS_TO_SEED) {
        let localPosterPath: string | null = null;

        if (work.posterUrl) {
            try {
                // filename e.g., "produce-48.jpg"
                const ext = work.posterUrl.split(".").pop();
                const safeName = work.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const filename = `${safeName}.${ext}`;
                const filePath = join(POSTERS_DIR, filename);
                localPosterPath = `/posters/${filename}`;

                const existing = Bun.file(filePath);
                if (!(await existing.exists())) {
                    console.log(`Downloading poster for '${work.title}'...`);
                    const res = await fetch(work.posterUrl);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);

                    await Bun.write(filePath, await res.arrayBuffer());
                    console.log(`Saved -> ${localPosterPath}`);
                } else {
                    console.log(`Poster for '${work.title}' already exists locally.`);
                }
            } catch (err) {
                console.error(`Failed to download poster for ${work.title}`, err);
            }
        }

        seededWorks.push({
            title: work.title,
            titleKorean: work.titleKorean,
            year: work.year,
            role: work.role,
            poster: localPosterPath,
            synopsis: work.synopsis,
            type: work.type,
        });
    }

    console.log("Inserting new seeded works into the database...");
    await db.insert(works).values(seededWorks);
    console.log(`Successfully seeded ${seededWorks.length} works with local images!`);
}

downloadPostersAndSeed().then(() => process.exit(0)).catch(console.error);
