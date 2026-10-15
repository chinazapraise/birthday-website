import type { Metadata } from "next";
import { timelineSeed, microMemoriesSeed } from "@/lib/content/timeline";
import { siteSettingsSeed } from "@/lib/content/site";
import HomeExperience from "@/components/home/HomeExperience";

export const metadata: Metadata = {
title: "CHINAZA / 21: The Story So Far",
description:
"2005-2026. Twenty-one years of memories, lessons, growth, and becoming.",
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
