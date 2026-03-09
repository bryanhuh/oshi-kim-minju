import { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";
import { fetchImages, fetchInstagram } from "@/lib/api";

export const metadata: Metadata = {
  title: "Gallery — Kim Minju Fan Site",
  description: "Photo gallery of Kim Minju — photoshoots, drama stills, events, and magazine covers.",
};

export default async function GalleryPage() {
  const images = await fetchImages();
  const instagram = await fetchInstagram();

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <GalleryClient initialImages={images} initialInstagram={instagram} />
    </main>
  );
}
