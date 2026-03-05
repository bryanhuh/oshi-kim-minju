import { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery — Kim Minju Fan Site",
  description: "Photo gallery of Kim Minju — photoshoots, drama stills, events, and magazine covers.",
};

export default function GalleryPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <GalleryClient />
    </main>
  );
}
