import HeroSection from "@/components/hero/HeroSection";
import HomeTeaser from "@/components/home/HomeTeaser";
import NewsClient from "@/components/news/NewsClient";
import { fetchNews } from "@/lib/api";

export default async function Home() {
  const news = await fetchNews();

  return (
    <main>
      <HeroSection />
      <HomeTeaser />
      <NewsClient news={news} />
    </main>
  );
}
