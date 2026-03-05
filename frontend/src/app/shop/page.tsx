import { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";
import { fetchShop } from "@/lib/api";
import type { ShopItem } from "@/types";

export const metadata: Metadata = {
  title: "Shop — Kim Minju Fan Site",
  description: "Official merchandise, albums, and media featuring Kim Minju.",
};

export default async function ShopPage() {
  const items: ShopItem[] = await fetchShop();
  return (
    <main className="pt-28 pb-20 min-h-screen">
      <ShopClient items={items} />
    </main>
  );
}
