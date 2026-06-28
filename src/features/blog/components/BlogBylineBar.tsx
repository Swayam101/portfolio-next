// components/blog/BlogBylineBar.tsx
import React from "react";
import type { BlogCategory } from "@/features/blog/types";
import { BLOG_CATEGORIES } from "@/features/blog/types";

interface Props {
  readTime?: string;
  tags?: string;
  date?: string;
  category?: BlogCategory;
}

function getCategoryLabel(slug?: BlogCategory): string | null {
  if (!slug) return null;
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? null;
}

const Sep = () => <span className="text-[#b8dede] select-none" aria-hidden>—</span>;

export function BlogBylineBar({ readTime, tags, date, category }: Props) {
  const categoryLabel = getCategoryLabel(category);

  return (
    <div
      className="bg-[#d4f0f0] border-b border-[#b8dede] px-5 sm:px-8 lg:px-14 py-3 font-mono text-[10px] sm:text-[11px] tracking-[0.1em] text-[#2e4a5a]"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-5">
        {categoryLabel && (
          <>
            <span>
              <strong className="text-[#1a2e3b]">{categoryLabel}</strong>
            </span>
            <Sep />
          </>
        )}

        {readTime && (
          <span>{readTime}</span>
        )}

        {tags && (
          <>
            <span className="hidden sm:inline">
              <Sep />
            </span>
            <span className="hidden sm:inline">{tags}</span>
          </>
        )}

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
