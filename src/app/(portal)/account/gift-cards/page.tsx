import type { Metadata } from "next";
import { GiftCardsView } from "@/components/account/gift-cards-view";

export const metadata: Metadata = { title: "Gift Cards" };

export default function GiftCardsPage() {
  return <GiftCardsView />;
}
