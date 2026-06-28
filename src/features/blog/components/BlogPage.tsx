"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { BlogPostWithSlug, BlogSeriesGroup } from "@/features/blog/types";

import { BlogMasthead } from "./BlogMasthead";
import { BlogHero } from "./BlogHero";
import { BlogBylineBar } from "./BlogBylineBar";
import { BlogSeriesNav } from "./BlogSeriesNav";
import { BlogSection } from "./BlogSection";
import { BlogSidebar } from "./BlogSidebar";
import { BlogCloser, BlogFooter } from "./BlogCloser";
import { LanguageModal } from "./LanguageModal";
import { HeaderLangSwitcher } from "./HeaderLangSwitcher";

interface Props {
  post: BlogPostWithSlug;
  series?: BlogSeriesGroup | null;
}

export function BlogPage({ post, series }: Props) {
  const [lang, setLang] = useState<"en" | "hi" | "hinglish">("en");
  const [modalOpen, setModalOpen] = useState(false);

  const hasHindi = !!post.parsedHindi;
  const hasHinglish = !!post.parsedHinglish;
  const hasTranslations = hasHindi || hasHinglish;

  // Show modal on every page load if translations are available
  useEffect(() => {
    if (hasTranslations) {
      // Slight delay so the page paints first — feels less jarring
      const t = setTimeout(() => setModalOpen(true), 320);
      return () => clearTimeout(t);
    }
  }, [hasTranslations]);

  const handleLangSelect = useCallback((selected: "en" | "hi" | "hinglish") => {
    setLang(selected);
  }, []);

  const handleOpenModal = useCallback(() => setModalOpen(true), []);
  const handleCloseModal = useCallback(() => setModalOpen(false), []);

  const currentData =
    lang === "hi" && post.parsedHindi ? post.parsedHindi :
      lang === "hinglish" && post.parsedHinglish ? post.parsedHinglish :
        post;

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
      {/* ── MASTHEAD — pass lang switcher as a slot/prop if BlogMasthead supports it,
           otherwise render the switcher in an absolutely-positioned overlay here.
           Two patterns shown; pick whichever fits your BlogMasthead API. ── */}

      {/* Pattern A — if BlogMasthead accepts a `actions` prop: */}
      <BlogMasthead
        tags={post.tags}
        actions={hasTranslations ? (
          <HeaderLangSwitcher
            current={lang}
            hasHindi={hasHindi}
            hasHinglish={hasHinglish}
            onSelect={handleLangSelect}
            onOpenModal={handleOpenModal}
          />
        ) : undefined}
      />



      {/* ── LEGACY INLINE SWITCHER (kept for backward compat; hidden when modal is enabled) ──
           You can remove this block entirely if you want the header pill to be the only
           inline control — the modal handles first-load selection. ── */}


      <BlogHero
        kicker={currentData.KICKER}
        title={currentData.BLOG_TITLE}
        subtitle={currentData.SUBTITLE}
      />

      <BlogBylineBar
        readTime={post.readTime}
        tags={post.tags}
        date={post.date}
        category={post.category}
      />

      {series && <BlogSeriesNav currentSlug={post.slug} series={series} />}

      <BlogSidebar toc={currentData.SIDEBAR_TOC} mobileOnly />

      {/* ── ARTICLE BODY ── */}
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-10 flex items-start gap-0">
        <main className="flex-1 min-w-0 pb-16 pt-10 lg:pr-14 lg:border-r lg:border-[#b8dede]">
          {currentData.SECTIONS.map((section, i) => (
            <BlogSection key={i} section={section} sectionIndex={i} />
          ))}
        </main>

        <BlogSidebar toc={currentData.SIDEBAR_TOC} desktopOnly />
      </div>

      {/* ── CLOSER ── */}
      <BlogCloser quote={currentData.CLOSING_QUOTE} />

      {/* ── FOOTER ── */}
      <BlogFooter
        tags={post.tags}
        title={currentData.BLOG_TITLE}
        date={post.date}
      />

      {/* ── LANGUAGE MODAL ── */}
      {hasTranslations && (
        <LanguageModal
          open={modalOpen}
          current={lang}
          hasHindi={hasHindi}
          hasHinglish={hasHinglish}
          onSelect={handleLangSelect}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}