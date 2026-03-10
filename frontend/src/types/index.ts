export interface Work {
  id: number;
  title: string;
  titleKorean: string | null;
  year: number | null;
  role: string | null;
  poster: string | null;
  synopsis: string | null;
  trailerUrl: string | null;
  type: "drama" | "movie" | "variety" | "video" | null;
}

export interface GalleryImage {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  category: "photoshoot" | "drama_still" | "event" | "magazine" | "instagram" | null;
  source: string | null;
  altText: string | null;
  uploadedAt: string;
}

export interface InstagramPost {
  id: number;
  postId: string;
  imageUrl: string | null;
  caption: string | null;
  likes: number | null;
  postedAt: string | null;
  images?: string[];
}

export interface NewsItem {
  id: number;
  title: string;
  source: string | null;
  url: string | null;
  publishedAt: string | null;
}

export interface ShopItem {
  id: number;
  title: string;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
  shopUrl: string | null;
  category: string | null;
  source: string | null;
  createdAt: string | null;
}

export interface Profile {
  id: number;
  name: string | null;
  nameKorean: string | null;
  birthdate: string | null;
  agency: string | null;
  bio: string | null;
}
