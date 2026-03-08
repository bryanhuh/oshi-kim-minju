import { db } from "./src/db";
import { works, shopItems } from "./src/db/schema";

async function clearTables() {
    console.log("Cleaning up database tables...");

    try {
        console.log("Deleting all works...");
        await db.delete(works);

        console.log("Deleting all shop items...");
        await db.delete(shopItems);

        console.log("Cleanup completed successfully.");
    } catch (err) {
        console.error("Error during cleanup:", err);
    } finally {
        process.exit(0);
    }
}

clearTables();
