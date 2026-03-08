import { Hono } from "hono";

const proxy = new Hono();

proxy.get("/", async (c) => {
    const targetUrl = c.req.query("url");
    if (!targetUrl) {
        return c.json({ error: "Missing url parameter" }, 400);
    }

    try {
        const res = await fetch(targetUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.hancinema.net/",
                "Sec-Fetch-Dest": "image",
                "Sec-Fetch-Mode": "no-cors",
                "Sec-Fetch-Site": "same-site",
            },
        });

        if (!res.ok) {
            console.warn(`[proxy] Upstream returned HTTP ${res.status} for ${targetUrl}`);
            // Extract some unique ID from the filename or URL to seed the fallback
            const match = targetUrl.match(/(\\d+)/);
            const seed = match ? match[1] : Math.floor(Math.random() * 1000).toString();
            return c.redirect(`https://picsum.photos/seed/drama-proxy-${seed}/400/600`);
        }

        const contentType = res.headers.get("content-type");
        const arrayBuffer = await res.arrayBuffer();

        return c.body(arrayBuffer, 200, {
            "Content-Type": contentType || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
            "Cross-Origin-Resource-Policy": "cross-origin",
        });
    } catch (err) {
        console.error("[proxy] Error:", err);
        // Fallback on total failure
        const seed = Math.floor(Math.random() * 1000).toString();
        return c.redirect(`https://picsum.photos/seed/drama-proxy-${seed}/400/600`);
    }
});

export default proxy;
