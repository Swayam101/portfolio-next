// components/blog/BlogBylineBar.tsx
import React from "react";

interface Props {
  readTime: string;
  tags: string;
  date?: string;
}

const Sep = () => <span className="text-[#b8dede] select-none" aria-hidden>—</span>;

export function BlogBylineBar({ readTime, tags, date }: Props) {
  return (
    <div
      className="bg-[#d4f0f0] border-b border-[#b8dede] px-5 sm:px-8 lg:px-14 py-3 font-mono text-[10px] sm:text-[11px] tracking-[0.1em] text-[#2e4a5a]"
    >
      {/* Mobile: stacked layout */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-5">
        <span>
          <strong className="text-[#1a2e3b]">In Depth</strong>
        </span>
        <Sep />
        <span>{readTime}</span>

        {/* Tags — hidden on very small screens to avoid crowding */}
        <span className="hidden sm:inline">
          <Sep />
        </span>
        <span className="hidden sm:inline">{tags}</span>

        {date && (
          <>
            <Sep />
            <span>{date}</span>
          </>
        )}
      </div>
    </div>
  );
}
