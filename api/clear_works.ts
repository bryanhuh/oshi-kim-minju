import { db } from "./src/db";
import { works } from "./src/db/schema";
import { count } from "drizzle-orm";

async function clearWorks() {
    try {
        const [{ value: beforeCount }] = await db.select({ value: count() }).from(works);
        console.log(`Works count before: ${beforeCount}`);

        await db.delete(works);
        console.log("Deleted all works.");

        const [{ value: afterCount }] = await db.select({ value: count() }).from(works);
        console.log(`Works count after: ${afterCount}`);
    } catch (err) {
        console.error("Error clearing works:", err);
    } finally {
        process.exit(0);
    }
}

clearWorks();
