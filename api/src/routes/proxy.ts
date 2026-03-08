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
                Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
            },
        });

        if (!res.ok) {
            return c.json({ error: "Failed to fetch image" }, res.status as any);
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
        return c.json({ error: "Proxy error" }, 500);
    }
});

export default proxy;
