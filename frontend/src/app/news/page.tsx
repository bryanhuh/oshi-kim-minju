import { Metadata } from "next";
import NewsClient from "@/components/news/NewsClient";
import { fetchNews } from "@/lib/api";
import type { NewsItem } from "@/types";

export const metadata: Metadata = {
  title: "News — Kim Minju Fan Site",
  description: "Latest news and headlines featuring Kim Minju.",
};

export default async function NewsPage() {
  const news: NewsItem[] = await fetchNews();
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <NewsClient news={news} />
    </main>
  );
}
