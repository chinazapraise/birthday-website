import type { Metadata } from "next";
import WishesExperience from "@/components/wishes/WishesExperience";

export const metadata: Metadata = {
  title: "Wishes · 21",
  description: "Leave Chinaza something she can keep.",
};

export default function WishesPage() {
  return <WishesExperience />;
}