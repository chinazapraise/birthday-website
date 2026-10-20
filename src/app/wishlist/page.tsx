import type { Metadata } from "next";
import WishlistExperience from "@/components/wishlist/WishlistExperience";

export const metadata: Metadata = {
  title: "Wishlist · 21",
  description: "21 things I’d love. No pressure.",
};

export default function WishlistPage() {
  return <WishlistExperience />;
}