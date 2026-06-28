// components/blog/index.ts
// ─────────────────────────────────────────────
//  Single entry point — import everything from here:
//  import { BlogPage, BlogHero, StatStrip, ... } from "@/components/blog";
// ─────────────────────────────────────────────

export { BlogPage } from "./BlogPage";
export { BlogMasthead } from "./BlogMasthead";
export { BlogHero } from "./BlogHero";
export { BlogBylineBar } from "./BlogBylineBar";
export { BlogPostListItem } from "./BlogPostListItem";
export { BlogSeriesNav, formatSeriesTitle } from "./BlogSeriesNav";
export { BlogSection } from "./BlogSection";
export { BlogSidebar } from "./BlogSidebar";
export { BlogCloser, BlogFooter } from "./BlogCloser";

export { ImageBlock, StatStripResponsive, GridBlock, Callout, PullQuote } from "./BlogComponents";

export type {
  BlogPost,
  BlogPostWithSlug,
  BlogMetadata,
  BlogCategory,
  BlogSeriesGroup,
  BlogCategoryGroup,
  BlogCatalog,
  BlogSection as BlogSectionType,
  BlogComponent,
} from "@/features/blog/types";

export { BLOG_CATEGORIES } from "@/features/blog/types";
