// components/blog/BlogPage.tsx
import React from "react";
import type { BlogPostWithSlug, BlogSeriesGroup } from "@/features/blog/types";
import { BlogMasthead } from "./BlogMasthead";
import { BlogHero } from "./BlogHero";
import { BlogBylineBar } from "./BlogBylineBar";
import { BlogSeriesNav } from "./BlogSeriesNav";
import { BlogSection } from "./BlogSection";
import { BlogSidebar } from "./BlogSidebar";
import { BlogCloser, BlogFooter } from "./BlogCloser";

interface Props {
  post: BlogPostWithSlug;
  series?: BlogSeriesGroup | null;
}

export function BlogPage({ post, series }: Props) {
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
      <BlogMasthead tags={post.tags} />

      <BlogHero
        kicker={post.KICKER}
        title={post.BLOG_TITLE}
        subtitle={post.SUBTITLE}
      />

      <BlogBylineBar
        readTime={post.readTime}
        tags={post.tags}
        date={post.date}
        category={post.category}
      />

      {series && <BlogSeriesNav currentSlug={post.slug} series={series} />}

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
        tags={post.tags}
        title={post.BLOG_TITLE}
        date={post.date}
      />
    </div>
  );
}
