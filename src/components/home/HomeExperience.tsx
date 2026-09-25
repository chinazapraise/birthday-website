"use client";

import { useCallback, useRef, useState } from "react";
import type { SiteSettings, TimelineYear, MicroMemory } from "@/lib/types";
import { useSettings } from "@/lib/hooks";
import Preloader from "@/components/home/Preloader";
import HeroExperience from "@/components/home/HeroExperience";
import PhotoFan from "@/components/home/PhotoFan";
import Timeline from "@/components/home/Timeline";
import PresentDay from "@/components/home/PresentDay";
import PeopleMosaic from "@/components/home/PeopleMosaic";
import EndingChapter from "@/components/home/EndingChapter";
import FloatingNav from "@/components/nav/FloatingNav";
import StoryProgress from "@/components/nav/StoryProgress";
import MeshBackground from "@/components/ambient/MeshBackground";
import CursorGlow from "@/components/ambient/CursorGlow";
import AudioControl from "@/components/ui/AudioControl";
import ConfettiLayer, { fireConfetti } from "@/components/effects/ConfettiLayer";

interface Props {
  settings: SiteSettings;
  years: TimelineYear[];
  memories: MicroMemory[];
}

export default function HomeExperience({ settings: initialSettings, years, memories }: Props) {
  const { settings: liveSettings } = useSettings();
  const settings = liveSettings ?? initialSettings;
  const [ready, setReady] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const clickCount = useRef(0);

  const onReady = useCallback(() => {
    setReady(true);
    // Entrance celebration: every time the homepage reveals — first visit
    // or any refresh — a big full-screen confetti + balloon burst.
    window.setTimeout(() => fireConfetti("grand", { balloons: 12 }), 600);
  }, []);

  // Easter egg: click "27" 7 times → celebratory burst with balloons
  const handle27Click = () => {
    clickCount.current += 1;
    if (clickCount.current >= 7) {
      clickCount.current = 0;
      fireConfetti("burst", { count: 60, balloons: 4 });
    }
  };

  void ready;
  void handle27Click;

  return (
    <>
      <Preloader onDone={onReady} />
      <MeshBackground />
      <CursorGlow />
      <ConfettiLayer />
      <FloatingNav />
      <StoryProgress />
      {settings?.social?.whatsapp && <AudioControl />}

      <div className="relative z-10">
        <HeroExperience
          settings={settings}
          onNext={() => {}}
          timelineRef={timelineRef as React.RefObject<HTMLElement | null>}
        />

        <PhotoFan />

        <div ref={timelineRef} onClick={handle27Click}>
          <Timeline years={years} memories={memories} />
        </div>

        <PresentDay />
        {settings.people && settings.people.length > 0 && (
          <PeopleMosaic people={settings.people} />
        )}
        <EndingChapter settings={settings} />
      </div>
    </>
  );
}