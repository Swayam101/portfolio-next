// components/blog/BlogCloser.tsx
import React from "react";
import Link from "next/link";

interface CloserProps {
  quote: string;
}

export function BlogCloser({ quote }: CloserProps) {
  return (
    <div className="bg-[#1a2e3b] px-5 sm:px-10 lg:px-[60px] py-12 sm:py-16 text-center relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,191,191,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(91,191,191,0.04) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <p
        className="font-serif font-normal italic leading-[1.55] max-w-[600px] mx-auto mb-4 sm:mb-5 text-[#d4f0f0] relative"
        style={{ fontSize: "clamp(17px, 2.6vw, 26px)" }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#5bbfbf] relative">
        — Swayam Prajapat
      </span>
      <p
        className="font-serif font-light italic text-[rgba(141,217,217,0.45)] mt-3 relative"
        style={{ fontSize: "clamp(13px, 1.8vw, 15px)" }}
      >
        I write about technology, computing history, and software — for everyone.
      </p>

      {/* Back to blog link */}
      <div className="mt-10 sm:mt-12 relative">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-[#5bbfbf] no-underline border border-[rgba(91,191,191,0.4)] px-5 py-3 hover:border-[#5bbfbf] hover:bg-[rgba(91,191,191,0.07)] transition-all duration-200"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}

// ── FOOTER ──────────────────────────────────────────────────

interface FooterProps {
  tags: string;
  title: string;
  date?: string;
}

export function BlogFooter({ tags, title, date }: FooterProps) {
  const shortTitle = title.length > 40 ? title.slice(0, 40) + "…" : title;
  return (
    <footer className="bg-[#d4f0f0] border-t border-[#b8dede] px-5 sm:px-8 lg:px-[60px] py-4 font-mono text-[10px] tracking-[0.12em] uppercase text-[#6a8a9a]">
      {/* Mobile: stacked, Desktop: row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
        <span>Swayam Prajapat &nbsp;·&nbsp; Blog</span>
        <span className="hidden sm:inline">{tags}</span>
        <span>
          {shortTitle} {date ? `· ${date}` : ""}
        </span>
      </div>
    </footer>
  );
}
