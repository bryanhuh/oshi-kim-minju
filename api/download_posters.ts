import { db } from "./src/db";
import { works } from "./src/db/schema";
import { mirrorToCloudinary } from "./src/lib/cloudinary";

const WORKS_TO_SEED = [
    {
        title: "Produce 48",
        titleKorean: "프로듀스 48",
        year: 2018,
        role: "Contestant (12th place)",
        posterUrl: null,
        synopsis: "A collaboration survival show between Mnet and AKB48. 96 Korean and Japanese trainees compete for 12 debut spots in a new group. Minju finished in 12th place, debuting as a member of IZ*ONE.",
        type: "variety",
    },
    {
        title: "Welcome to Waikiki 2",
        titleKorean: "으라차차 와이키키 2",
        year: 2019,
        role: "Han Yoon-ah",
        posterUrl: null,
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
        posterUrl: null,
        synopsis: "A politician's wife with a dark secret is thrust into a moral dilemma. Kim Soo-bin is a high school student whose life becomes entangled in a political scandal that tears families apart.",
        type: "drama",
    },
    {
        title: "Ask the Stars",
        titleKorean: "별에게 물어봐",
        year: 2023,
        role: "Oh Bok-soon",
        posterUrl: null,
        synopsis: "A romantic comedy set aboard the first commercial space station. Oh Bok-soon is a spirited crew member who falls in love with a surgeon who boards the station.",
        type: "drama",
    },
    {
        title: "The Midnight Studio",
        titleKorean: "심야화실",
        year: 2024,
        role: "Hong Ye-seul",
        posterUrl: null,
        synopsis: "A mysterious midnight art studio draws in a young art student, Hong Ye-seul, who encounters a reclusive painter and uncovers the secrets hidden within his work.",
        type: "drama",
    },
];

async function downloadPostersAndSeed() {
    console.log("Emptying existing works from DB...");
    await db.delete(works);

    const seededWorks = [];

    for (const work of WORKS_TO_SEED) {
        let posterPath: string | null = null;

        if (work.posterUrl) {
            try {
                const safeName = work.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                console.log(`Uploading poster for '${work.title}' to Cloudinary...`);
                const cloudUrl = await mirrorToCloudinary(work.posterUrl, safeName, "minju/posters");
                posterPath = cloudUrl;
            } catch (err) {
                console.error(`Failed to upload poster for ${work.title}`, err);
            }
        }

        seededWorks.push({
            title: work.title,
            titleKorean: work.titleKorean,
            year: work.year,
            role: work.role,
            poster: posterPath,
            synopsis: work.synopsis,
            type: work.type,
        });
    }

    console.log("Inserting new seeded works into the database...");
    await db.insert(works).values(seededWorks);
    console.log(`Successfully seeded ${seededWorks.length} works with Cloudinary images!`);
}

downloadPostersAndSeed().then(() => process.exit(0)).catch(console.error);
