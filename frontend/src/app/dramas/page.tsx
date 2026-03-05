import { Metadata } from "next";
import DramasClient from "@/components/dramas/DramasClient";

export const metadata: Metadata = {
  title: "Dramas & Films — Kim Minju Fan Site",
  description: "All dramas, films, and variety shows featuring Kim Minju.",
};

export default function DramasPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <DramasClient />
    </main>
  );
}
