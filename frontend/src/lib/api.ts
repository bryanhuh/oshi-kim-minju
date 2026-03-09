const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/api/profile`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchWorks(type?: string) {
  const url = type
    ? `${API_BASE}/api/works?type=${type}`
    : `${API_BASE}/api/works`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchImages(category?: string, limit = 50, offset = 0) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (category) params.set("category", category);
  const res = await fetch(`${API_BASE}/api/images?${params}`, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchInstagram(limit = 30, offset = 0) {
  const res = await fetch(`${API_BASE}/api/instagram?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchShop(limit = 50, offset = 0) {
  const res = await fetch(`${API_BASE}/api/shop?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchNews(limit = 20, offset = 0) {
  const res = await fetch(`${API_BASE}/api/news?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return [];
  return res.json();
}

export function getProxyImageUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  // Local static files (/posters/*) are served directly — no proxy needed
  if (url.startsWith("/") || url.startsWith("http://localhost")) return url;

  // Proxy all other remote URLs to avoid CORS and ORB issues
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}

/** Returns true if the URL will be served through the local proxy (requires unoptimized on next/image) */
export function needsProxy(url: string | null | undefined): boolean {
  if (!url) return false;
  // All remote URLs need proxying to avoid browser security blocks
  return !url.startsWith("/") && !url.startsWith("http://localhost");
}
