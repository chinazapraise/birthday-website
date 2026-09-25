import type { Metadata } from "next";
import { timelineSeed, microMemoriesSeed } from "@/lib/content/timeline";
import { siteSettingsSeed } from "@/lib/content/site";
import { readPeople } from "@/lib/photoCloud";
import HomeExperience from "@/components/home/HomeExperience";

export const metadata: Metadata = {
  title: "27: The Story So Far",
  description:
    "2016-2026. Eleven years. A lot happened before we got here.",
};

export default async function HomePage() {
  const cloudPeople = await readPeople().catch(() => null);
  const initialSettings = {
    ...siteSettingsSeed,
    ...(cloudPeople && cloudPeople.length > 0 ? { people: cloudPeople } : {}),
  };
  return (
    <HomeExperience
      settings={initialSettings}
      years={timelineSeed}
      memories={microMemoriesSeed}
    />
  );
}