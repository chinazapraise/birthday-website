import type { Metadata } from "next";
import { timelineSeed, microMemoriesSeed } from "@/lib/content/timeline";
import { siteSettingsSeed } from "@/lib/content/site";
import HomeExperience from "@/components/home/HomeExperience";

export const metadata: Metadata = {
  title: "27: The Story So Far",
  description:
    "2016-2026. Eleven years. A lot happened before we got here.",
};

export default function HomePage() {
  return (
    <HomeExperience
      settings={siteSettingsSeed}
      years={timelineSeed}
      memories={microMemoriesSeed}
    />
  );
}