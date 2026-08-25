import type { Metadata } from "next";
import { RewardsView } from "@/components/account/rewards-view";

export const metadata: Metadata = { title: "Rewards" };

export default function RewardsPage() {
  return <RewardsView />;
}
