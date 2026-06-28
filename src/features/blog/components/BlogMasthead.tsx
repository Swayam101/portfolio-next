// components/blog/BlogMasthead.tsx
import React from "react";
import Link from "next/link";

interface Props {
  tags?: string;
  actions?: React.ReactNode;
}

export function BlogMasthead({ tags, actions }: Props) {
  return (
    <div
      className="bg-[#1a2e3b] border-b-[3px] border-[#5bbfbf]"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Nav row */}
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-14 py-3 border-b border-[rgba(91,191,191,0.2)]">
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8dd9d9] no-underline hover:text-white transition-colors duration-150"
        >
          ← swayam.space
        </Link>

        {actions ? (
          /* When actions are passed, render them here (position: relative on parent handles the alignment) */
          <div style={{ position: "relative" }}>
            {actions}
          </div>
        ) : (
          /* Otherwise show the fallback navigation link */
          <Link
            href="/blog"
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#5bbfbf] no-underline hover:text-[#8dd9d9] transition-colors duration-150"
          >
            All Posts
          </Link>
        )}
      </div>

      {/* Kicker strip — topic labels, shown in full on desktop */}
      <div className="text-center px-5 py-[10px] font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf]">
        <span className="hidden sm:inline">Technology &amp; Computing &nbsp;·&nbsp; </span>
        {tags}
      </div>
    </div>
  );
}
