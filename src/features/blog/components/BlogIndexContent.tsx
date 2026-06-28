"use client";

import { useState } from "react";
import { BlogPostListItem } from "./BlogPostListItem";
import { formatSeriesTitle } from "./BlogSeriesNav";
import type { BlogCatalog, BlogCategory, BlogPostWithSlug } from "@/features/blog/types";
import { BLOG_CATEGORIES } from "@/features/blog/types";

interface Props {
  catalog: BlogCatalog;
}

type FilterTab = "all" | BlogCategory;

const TABS: { slug: FilterTab; label: string }[] = [
  { slug: "all", label: "All" },
  ...BLOG_CATEGORIES,
];

export function BlogIndexContent({ catalog }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const allPosts: BlogPostWithSlug[] = [
    ...catalog.series.flatMap((g) => g.posts),
    ...catalog.categories.flatMap((g) => g.posts),
    ...catalog.standalone,
  ];

  const filteredPosts =
    activeTab === "all"
      ? allPosts
      : allPosts.filter((p) => p.category === activeTab);

  const isFiltered = activeTab !== "all";

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10 sm:mb-12">
        {TABS.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            className={`font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-150 cursor-pointer ${
              activeTab === tab.slug
                ? "bg-[#1a2e3b] text-[#d4f0f0] border-[#1a2e3b]"
                : "bg-transparent text-[#5a7a8a] border-[#c8e8e8] hover:border-[#5bbfbf] hover:text-[#1a2e3b]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtered view — flat list of matching posts */}
      {isFiltered && (
        <>
          {filteredPosts.length > 0 ? (
            <div className="divide-y divide-[#c8e8e8]">
              {filteredPosts.map((post, index) => (
                <BlogPostListItem
                  key={post.slug}
                  post={post}
                  indexWatermark={String(index + 1).padStart(2, "0")}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p
                className="font-serif italic text-[#6a8a9a]"
                style={{ fontSize: "clamp(16px, 2.5vw, 20px)" }}
              >
                No essays in this category yet.
              </p>
            </div>
          )}
        </>
      )}

      {/* All view — grouped sections */}
      {!isFiltered && (
        <>
          {/* Series */}
          {catalog.series.map((group) => (
            <section key={group.seriesSlug} className="mb-16 sm:mb-20">
              <div className="mb-6 pb-5 border-b border-[#c8e8e8]">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf] m-0 mb-2">
                  Series · {group.posts.length}{" "}
                  {group.posts.length === 1 ? "part" : "parts"}
                </p>
                <h2
                  className="font-serif font-bold text-[#1a2e3b] m-0 mb-2 leading-[1.15]"
                  style={{ fontSize: "clamp(22px, 3.5vw, 30px)" }}
                >
                  {formatSeriesTitle(group.seriesSlug)}
                </h2>
                {group.seriesDescription && (
                  <p
                    className="font-serif font-light italic text-[#4a6a7a] m-0 leading-[1.7] max-w-[560px]"
                    style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
                  >
                    {group.seriesDescription}
                  </p>
                )}
              </div>

              <div className="divide-y divide-[#c8e8e8] border-l-2 border-[#5bbfbf]/25 pl-4 sm:pl-5">
                {group.posts.map((post, index) => (
                  <BlogPostListItem
                    key={post.slug}
                    post={post}
                    partLabel={`Part ${index + 1}`}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Category groups */}
          {catalog.categories.map((group) => (
            <section key={group.category} className="mb-16 sm:mb-20">
              <div className="mb-6 pb-5 border-b border-[#c8e8e8]">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf] m-0 mb-2">
                  {group.posts.length}{" "}
                  {group.posts.length === 1 ? "essay" : "essays"}
                </p>
                <h2
                  className="font-serif font-bold text-[#1a2e3b] m-0 leading-[1.15]"
                  style={{ fontSize: "clamp(22px, 3.5vw, 30px)" }}
                >
                  {group.label}
                </h2>
              </div>

              <div className="divide-y divide-[#c8e8e8]">
                {group.posts.map((post, index) => (
                  <BlogPostListItem
                    key={post.slug}
                    post={post}
                    indexWatermark={String(index + 1).padStart(2, "0")}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Uncategorized standalone */}
          {catalog.standalone.length > 0 && (
            <section className="mb-16 sm:mb-20">
              {catalog.categories.length > 0 && (
                <div className="mb-6 pb-5 border-b border-[#c8e8e8]">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf] m-0 mb-2">
                    {catalog.standalone.length}{" "}
                    {catalog.standalone.length === 1 ? "essay" : "essays"}
                  </p>
                  <h2
                    className="font-serif font-bold text-[#1a2e3b] m-0 leading-[1.15]"
                    style={{ fontSize: "clamp(22px, 3.5vw, 30px)" }}
                  >
                    Uncategorized
                  </h2>
                </div>
              )}

              <div className="divide-y divide-[#c8e8e8]">
                {catalog.standalone.map((post, index) => (
                  <BlogPostListItem
                    key={post.slug}
                    post={post}
                    indexWatermark={String(index + 1).padStart(2, "0")}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
