// components/blog/BlogHero.tsx
import React from "react";

interface Props {
  kicker: string;
  title: string;
  subtitle: string;
}

export function BlogHero({ kicker, title, subtitle }: Props) {
  return (
    <section
      className="bg-[#1a2e3b] px-5 sm:px-8 lg:px-14 pt-12 sm:pt-16 pb-10 sm:pb-14 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(141,217,217,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(141,217,217,0.05) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      {/* Kicker */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5 relative">
        <span className="block w-6 h-px bg-[#8dd9d9] shrink-0" />
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#8dd9d9]">
          {kicker}
        </span>
      </div>

      {/* Title */}
      <h1
        className="font-serif font-black leading-[1.05] sm:leading-[1.06] text-[#d4f0f0] tracking-[-0.02em] mb-5 sm:mb-6 max-w-[820px] relative"
        style={{ fontSize: "clamp(30px, 5.5vw, 66px)" }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="font-serif font-light italic text-[rgba(141,217,217,0.65)] leading-[1.65] max-w-[540px] pl-4 sm:pl-[18px] relative"
        style={{
          fontSize: "clamp(15px, 2vw, 18px)",
          borderLeft: "2px solid #5bbfbf",
        }}
      >
        {subtitle}
      </p>
    </section>
  );
}
