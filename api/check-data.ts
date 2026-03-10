import { db } from "./src/db/index.js";
import { instagramPosts, images } from "./src/db/schema.js";

async function checkData() {
    const posts = await db.select().from(instagramPosts).limit(5);
    console.log("Instagram Posts:", JSON.stringify(posts, null, 2));

    const imgRecords = await db.select().from(images).limit(5);
    console.log("Images:", JSON.stringify(imgRecords, null, 2));
}

checkData().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
});
