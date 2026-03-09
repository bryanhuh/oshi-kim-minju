import { Metadata } from "next";
import IZONEClient from "@/components/izone/IZONEClient";
import { fetchIZONEAlbums } from "@/lib/spotify";

export const metadata: Metadata = {
  title: "IZ*ONE Era — Kim Minju Fan Site",
  description: "A tribute to Kim Minju's journey with IZ*ONE.",
};

export default async function IZONEPage() {
  const albums = await fetchIZONEAlbums();

  return (
    <main className="pt-28 pb-20 min-h-screen overflow-x-hidden">
      <IZONEClient initialAlbums={albums} />
    </main>
  );
}
