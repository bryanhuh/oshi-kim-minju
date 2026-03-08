import { db } from "./src/db";
import { works, news } from "./src/db/schema";
import { count } from "drizzle-orm";

async function checkCounts() {
    try {
        const [{ value: worksCount }] = await db.select({ value: count() }).from(works);
        const [{ value: newsCount }] = await db.select({ value: count() }).from(news);

        console.log(`Works count: ${worksCount}`);
        console.log(`News count: ${newsCount}`);
    } catch (err) {
        console.error("Error checking counts:", err);
    } finally {
        process.exit(0);
    }
}

checkCounts();
