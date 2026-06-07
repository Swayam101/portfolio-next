/**
 * parseBlogYaml.ts
 * ─────────────────
 * Parses a raw YAML string (from /content/blogs/*.yaml) into a typed BlogPost.
 *
 * Usage (in Next.js getStaticProps or server component):
 *
 *   import fs from "fs";
 *   import path from "path";
 *   import { parseBlogYaml } from "@/lib/parseBlogYaml";
 *
 *   const raw = fs.readFileSync(path.join(process.cwd(), "content/blogs/my-post.yaml"), "utf8");
 *   const post = parseBlogYaml(raw);
 *
 * Install js-yaml:  npm install js-yaml @types/js-yaml
 */

import yaml from "js-yaml";
import type { BlogPost, BlogComponent, BlogSection } from "@/types/blog";

function normaliseComponent(raw: Record<string, unknown>): BlogComponent | null {
  // YAML components are stored as objects keyed by type name
  if ("IMAGE" in raw) {
    const c = raw["IMAGE"] as Record<string, unknown>;
    return { type: "IMAGE", TITLE: c.TITLE as string, DESCRIPTION: c.DESCRIPTION as string, ASPECT: (c.ASPECT ?? "wide") as "hero" | "wide" | "square", PLACEMENT: (c.PLACEMENT ?? "end_of_section") as "after_intro" | "after_first_para" | "end_of_section", SRC: c.SRC as string | undefined };
  }
  if ("STAT_STRIP" in raw) {
    const c = raw["STAT_STRIP"] as Record<string, unknown>;
    return { type: "STAT_STRIP", STATS: c.STATS as { NUM: string; LABEL: string }[] };
  }
  if ("GRID" in raw) {
    const c = raw["GRID"] as Record<string, unknown>;
    return { type: "GRID", ITEMS: c.ITEMS as { NUM: string; LABEL: string; TITLE: string; BODY: string }[] };
  }
  if ("CALLOUT" in raw) {
    const c = raw["CALLOUT"] as Record<string, unknown>;
    return { type: "CALLOUT", STYLE: (c.STYLE ?? "gold") as "gold" | "red", TEXT: c.TEXT as string };
  }
  if ("PULL_QUOTE" in raw) {
    const c = raw["PULL_QUOTE"] as Record<string, unknown>;
    return { type: "PULL_QUOTE", TEXT: c.TEXT as string };
  }
  return null;
}

export function parseBlogYaml(raw: string): BlogPost {
  const doc = yaml.load(raw) as Record<string, unknown>;

  const rawSections = (doc.SECTIONS ?? []) as Record<string, unknown>[];
  const sections: BlogSection[] = rawSections.map((item) => {
    const s = (item as Record<string, unknown>).SECTION as Record<string, unknown>;
    const rawComponents = (s.COMPONENTS ?? []) as Record<string, unknown>[];
    return {
      SECTION: {
        NUM: s.NUM as string,
        TITLE: s.TITLE as string,
        DROP_CAP: Boolean(s.DROP_CAP),
        CONTENT: s.CONTENT as string,
        COMPONENTS: rawComponents.map(normaliseComponent).filter(Boolean) as BlogComponent[],
      },
    };
  });

  return {
    BLOG_TITLE: doc.BLOG_TITLE as string,
    KICKER: doc.KICKER as string,
    SUBTITLE: doc.SUBTITLE as string,
    READ_TIME: doc.READ_TIME as string,
    TAGS: doc.TAGS as string,
    DATE: doc.DATE as string | undefined,
    CLOSING_QUOTE: doc.CLOSING_QUOTE as string,
    SECTIONS: sections,
    SIDEBAR_TOC: (doc.SIDEBAR_TOC ?? []) as { NUM: string; TITLE: string }[],
    SEO_TITLE: doc.SEO_TITLE as string | undefined,
    SEO_DESCRIPTION: doc.SEO_DESCRIPTION as string | undefined,
    OG_IMAGE: doc.OG_IMAGE as string | undefined,
  };
}
