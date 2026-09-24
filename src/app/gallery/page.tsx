import type { Metadata } from "next";
import { timelineSeed } from "@/lib/content/timeline";
import GalleryExperience from "@/components/gallery/GalleryExperience";

export const metadata: Metadata = {
  title: "Gallery · 27",
  description: "Every photo from the story so far, in one place.",
};

export default function GalleryPage() {
  return <GalleryExperience years={timelineSeed} />;
}