import { Metadata } from "next";
import IZONEMemoryClient from "@/components/izone/IZONEMemoryClient";

export const metadata: Metadata = {
  title: "IZ*ONE Memory — A Hidden Archive",
  description: "A secret tribute to Kim Minju's IZ*ONE journey.",
};

export default function IZONEMemoryPage() {
  return (
    <main className="min-h-screen">
      <IZONEMemoryClient />
    </main>
  );
}
