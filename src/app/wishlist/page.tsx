import type { Metadata } from "next";
import WishlistExperience from "@/components/wishlist/WishlistExperience";

export const metadata: Metadata = {
  title: "Wishlist — 27",
  description: "27 things I'd love. No pressure. ™",
};

export default function WishlistPage() {
  return <WishlistExperience />;
}