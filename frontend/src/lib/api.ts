const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE}/api/profile`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("fetchProfile failed:", err);
    return null;
  }
}

export async function fetchWorks(type?: string) {
  try {
    const url = type
      ? `${API_BASE}/api/works?type=${type}`
      : `${API_BASE}/api/works`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("fetchWorks failed:", err);
    return [];
  }
}

export async function fetchImages(category?: string, limit = 50, offset = 0) {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (category) params.set("category", category);
    const res = await fetch(`${API_BASE}/api/images?${params}`, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("fetchImages failed:", err);
    return [];
  }
}

export async function fetchInstagram(limit = 30, offset = 0) {
  try {
    const res = await fetch(`${API_BASE}/api/instagram?limit=${limit}&offset=${offset}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("fetchInstagram failed:", err);
    return [];
  }
}

export async function fetchShop(limit = 50, offset = 0) {
  try {
    const res = await fetch(`${API_BASE}/api/shop?limit=${limit}&offset=${offset}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("fetchShop failed:", err);
    return [];
  }
}

export async function fetchNews(limit = 20, offset = 0) {
  try {
    const res = await fetch(`${API_BASE}/api/news?limit=${limit}&offset=${offset}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("fetchNews failed:", err);
    return [];
  }
}
