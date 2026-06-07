// components/blog/BlogPage.tsx
import React from "react";
import type { BlogPost } from "@/types/blog";
import { BlogMasthead } from "./BlogMasthead";
import { BlogHero } from "./BlogHero";
import { BlogBylineBar } from "./BlogBylineBar";
import { BlogSection } from "./BlogSection";
import { BlogSidebar } from "./BlogSidebar";
import { BlogCloser, BlogFooter } from "./BlogCloser";

interface Props {
  post: BlogPost;
}

export function BlogPage({ post }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#f2fafa",
        color: "#1a2e3b",
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: "18px",
        lineHeight: 1.8,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── MASTHEAD ── */}
      <BlogMasthead tags={post.TAGS} />

      {/* ── HERO ── */}
      <BlogHero
        kicker={post.KICKER}
        title={post.BLOG_TITLE}
        subtitle={post.SUBTITLE}
      />

      {/* ── BYLINE BAR ── */}
      <BlogBylineBar
        readTime={post.READ_TIME}
        tags={post.TAGS}
        date={post.DATE}
      />

      {/* ── MOBILE/TABLET TOC — rendered ABOVE article body, part of BlogSidebar ── */}
      <BlogSidebar toc={post.SIDEBAR_TOC} mobileOnly />

      {/* ── ARTICLE BODY ── */}
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-10 flex items-start gap-0">
        {/* Main content */}
        <main className="flex-1 min-w-0 pb-16 pt-10 lg:pr-14 lg:border-r lg:border-[#b8dede]">
          {post.SECTIONS.map((section, i) => (
            <BlogSection key={i} section={section} sectionIndex={i} />
          ))}
        </main>

        {/* Desktop Sidebar */}
        <BlogSidebar toc={post.SIDEBAR_TOC} desktopOnly />
      </div>

      {/* ── CLOSER ── */}
      <BlogCloser quote={post.CLOSING_QUOTE} />

      {/* ── FOOTER ── */}
      <BlogFooter
        tags={post.TAGS}
        title={post.BLOG_TITLE}
        date={post.DATE}
      />
    </div>
  );
}
