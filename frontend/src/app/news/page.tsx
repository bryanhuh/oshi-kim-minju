import { Metadata } from "next";
import NewsClient from "@/components/news/NewsClient";

export const metadata: Metadata = {
  title: "News — Kim Minju Fan Site",
  description: "Latest news and headlines featuring Kim Minju.",
};

export default function NewsPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <NewsClient />
    </main>
  );
}
