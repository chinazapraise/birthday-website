import type { Metadata } from "next";
import StoriesExperience from "@/components/stories/StoriesExperience";

export const metadata: Metadata = {
  title: "Your Stories · 27",
  description: "Everybody knows a different version of Tomide. Tell him yours.",
};

export default function StoriesPage() {
  return <StoriesExperience />;
}