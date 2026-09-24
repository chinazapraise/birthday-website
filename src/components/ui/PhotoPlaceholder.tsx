"use client";

import { Image as ImageIcon } from "@phosphor-icons/react";
import { useMemo } from "react";

/**
 * Neutral, replaceable image slot. Never depends on placeholder content
 * for layout — fixed aspect from the media entry.
 */
export default function PhotoPlaceholder({
  label,
  aspect = "4:5",
  className,
  style,
  tint = "#3b2f5f",
  onClick,
}: {
  label: string;
  aspect?: string;
  className?: string;
  style?: React.CSSProperties;
  tint?: string;
  onClick?: () => void;
}) {
  const [w, h] = useMemo(() => {
    const [a, b] = aspect.split(":").map(Number);
    return [a || 4, b || 5];
  }, [aspect]);

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative overflow-hidden rounded-xl border border-white/10 ${className ?? ""}`}
      style={{
        aspectRatio: `${w}/${h}`,
        background: `linear-gradient(145deg, ${tint} 0%, #171327 65%)`,
        ...style,
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 20%, rgba(139,92,246,0.35) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <ImageIcon size={20} className="text-cream/40" />
        <span className="max-w-[90%] font-mono text-[0.6rem] leading-relaxed text-cream/35 uppercase tracking-wide md:text-[0.65rem]">
          {label}
        </span>
      </div>
    </div>
  );
}