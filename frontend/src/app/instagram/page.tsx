import { Metadata } from "next";
import InstagramClient from "@/components/instagram/InstagramClient";

export const metadata: Metadata = {
  title: "Instagram Archive — Kim Minju Fan Site",
  description: "A polaroid archive of Kim Minju's Instagram posts.",
};

export default function InstagramPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <InstagramClient />
    </main>
  );
}
