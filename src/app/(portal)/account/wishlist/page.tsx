import type { Metadata } from "next";
import { WishlistView } from "@/components/account/wishlist-view";

export const metadata: Metadata = { title: "Saved Looks" };

export default function WishlistPage() {
  return <WishlistView />;
}
