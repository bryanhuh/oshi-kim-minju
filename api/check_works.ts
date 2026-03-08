import { db } from "./src/db";
import { works } from "./src/db/schema";

async function checkWorks() {
    const allWorks = await db.select({ title: works.title, poster: works.poster }).from(works);
    console.log(JSON.stringify(allWorks, null, 2));
    process.exit(0);
}

checkWorks();
