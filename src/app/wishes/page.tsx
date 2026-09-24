import type { Metadata } from "next";
import WishesExperience from "@/components/wishes/WishesExperience";

export const metadata: Metadata = {
  title: "Wishes · 27",
  description: "Leave Tomide something he can keep.",
};

export default function WishesPage() {
  return <WishesExperience />;
}