import { Metadata } from "next";
import WorldClient from "@/components/world/WorldClient";

export const metadata: Metadata = {
  title: "Her World — Kim Minju Fan Site",
  description: "Explore Minju's world — a 3D interactive map of her universe.",
};

export default function WorldPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <WorldClient />
    </main>
  );
}
