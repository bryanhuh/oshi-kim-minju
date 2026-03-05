import { Metadata } from "next";
import IZONEClient from "@/components/izone/IZONEClient";

export const metadata: Metadata = {
  title: "IZ*ONE Era — Kim Minju Fan Site",
  description: "A tribute to Kim Minju's journey with IZ*ONE.",
};

export default function IZONEPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <IZONEClient />
    </main>
  );
}
