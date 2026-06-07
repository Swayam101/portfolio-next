// components/blog/index.ts
// ─────────────────────────────────────────────
//  Single entry point — import everything from here:
//  import { BlogPage, BlogHero, StatStrip, ... } from "@/components/blog";
// ─────────────────────────────────────────────

export { BlogPage } from "./BlogPage";
export { BlogMasthead } from "./BlogMasthead";
export { BlogHero } from "./BlogHero";
export { BlogBylineBar } from "./BlogBylineBar";
export { BlogSection } from "./BlogSection";
export { BlogSidebar } from "./BlogSidebar";
export { BlogCloser, BlogFooter } from "./BlogCloser";

// Individual content components (useful if you need them standalone)
export { ImageBlock, StatStrip, GridBlock, Callout, PullQuote } from "./BlogComponents";

// Types
export type { BlogPost, BlogSection as BlogSectionType, BlogComponent } from "@/types/blog";

// YAML parser (server-side only)
// export { parseBlogYaml } from "../lib/parseBlogYaml";
