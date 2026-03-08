import { Metadata } from "next";
import DramasClient from "@/components/dramas/DramasClient";
import { fetchWorks } from "@/lib/api";
import type { Work } from "@/types";

export const metadata: Metadata = {
  title: "Dramas & Films — Kim Minju Fan Site",
  description: "All dramas, films, and variety shows featuring Kim Minju.",
};

export default async function DramasPage() {
  const works: Work[] = await fetchWorks();
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <DramasClient works={works} />
    </main>
  );
}
