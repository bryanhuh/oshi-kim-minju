import { v2 as cloudinary } from "cloudinary";

// CLOUDINARY_URL env var is auto-configured by cloudinary
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cloudinary.config();

/**
 * Upload an image buffer to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(
  buffer: ArrayBuffer | Buffer,
  publicId: string,
  folder = "minju"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder,
        overwrite: false,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );

    const data = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    stream.end(data);
  });
}

/**
 * Check if an image already exists on Cloudinary.
 * Returns the secure URL if it exists, null otherwise.
 */
export async function getCloudinaryUrl(
  publicId: string,
  folder = "minju"
): Promise<string | null> {
  try {
    const result = await cloudinary.api.resource(`${folder}/${publicId}`);
    return result.secure_url;
  } catch {
    return null;
  }
}

/**
 * Download an image from a URL and upload it to Cloudinary.
 * Returns the Cloudinary secure URL, or null on failure.
 */
export async function mirrorToCloudinary(
  imageUrl: string,
  publicId: string,
  folder = "minju"
): Promise<string | null> {
  try {
    // Check if already uploaded
    const existing = await getCloudinaryUrl(publicId, folder);
    if (existing) {
      console.log(`[cloudinary] Already exists: ${folder}/${publicId}`);
      return existing;
    }

    // Download the image
    let res: Response;
    try {
      res = await fetch(imageUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Referer": "https://www.hancinema.net/",
        },
      });
    } catch (err) {
      console.warn(`[cloudinary] Initial fetch failed for ${imageUrl}, trying playwright...`);
      return await mirrorWithPlaywright(imageUrl, publicId, folder);
    }

    if (!res.ok) {
      console.warn(`[cloudinary] Failed to download ${imageUrl}: HTTP ${res.status}, trying playwright...`);
      return await mirrorWithPlaywright(imageUrl, publicId, folder);
    }

    const buffer = await res.arrayBuffer();
    const url = await uploadToCloudinary(buffer, publicId, folder);
    console.log(`[cloudinary] Uploaded: ${folder}/${publicId}`);
    return url;
  } catch (err) {
    console.error(`[cloudinary] Error mirroring ${imageUrl}:`, err);
    return null;
  }
}

/**
 * Use Playwright to download an image if normal fetch fails.
 */
async function mirrorWithPlaywright(
  imageUrl: string,
  publicId: string,
  folder = "minju"
): Promise<string | null> {
  const { chromium } = await import("playwright");
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    try {
      // For direct images, 'load' or even just responding is enough
      const response = await page.goto(imageUrl, { waitUntil: 'load', timeout: 20000 });

      if (!response || !response.ok()) {
        console.warn(`[cloudinary] Playwright failed to download ${imageUrl}: HTTP ${response?.status()}`);
        return null;
      }

      const buffer = await response.body();
      const url = await uploadToCloudinary(buffer, publicId, folder);
      console.log(`[cloudinary] Uploaded (via Playwright): ${folder}/${publicId}`);
      return url;
    } catch (err) {
      console.error(`[cloudinary] Playwright error for ${imageUrl}:`, err);
      return null;
    } finally {
      await page.close();
    }
  } catch (err) {
    console.error(`[cloudinary] Playwright browser launch/context error for ${imageUrl}:`, err);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

export { cloudinary };
