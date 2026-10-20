import type { Metadata } from "next";
import StoriesExperience from "@/components/stories/StoriesExperience";

export const metadata: Metadata = {
  title: "Your Stories · 21",
  description: "Everybody knows a different version of Chinaza. Tell her yours.",
};

export default function StoriesPage() {
  return <StoriesExperience />;
}