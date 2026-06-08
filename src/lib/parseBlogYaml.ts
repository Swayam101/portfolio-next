/**
 * parseBlogYaml.ts
 */

import yaml from "js-yaml";
import type { BlogPost, BlogComponent, BlogSection } from "@/types/blog";

function normaliseComponent(raw: Record<string, unknown>): BlogComponent | null {
  // ── Shape A: { type: "IMAGE", TITLE: ..., SRC: ... }  (flat)
  // ── Shape B: { IMAGE: { TITLE: ..., SRC: ... } }      (nested key)
  // Detect which shape we have and normalise to flat.

  let type: string | undefined;
  let c: Record<string, unknown>;

  if (typeof raw.type === "string") {
    // Shape A — already flat
    type = raw.type.toUpperCase();
    c = raw;
  } else {
    // Shape B — find the key that is the type name
    const key = Object.keys(raw).find((k) =>
      ["IMAGE", "STAT_STRIP", "GRID", "CALLOUT", "PULL_QUOTE"].includes(k.toUpperCase())
    );
    if (!key) {
      console.warn("[parseBlogYaml] Unrecognised component shape:", raw);
      return null;
    }
    type = key.toUpperCase();
    c = (raw[key] ?? {}) as Record<string, unknown>;
  }

  switch (type) {
    case "IMAGE":
      return {
        type: "IMAGE",
        TITLE: (c.TITLE as string) ?? "",
        DESCRIPTION: (c.DESCRIPTION as string) ?? "",
        ASPECT: (c.ASPECT as "hero" | "wide" | "square") ?? "wide",
        PLACEMENT: (c.PLACEMENT as "after_intro" | "after_first_para" | "end_of_section") ?? "end_of_section",
        SRC: (c.SRC as string | undefined) ?? undefined,
      };

    case "STAT_STRIP":
      return {
        type: "STAT_STRIP",
        STATS: (c.STATS as { NUM: string; LABEL: string }[]) ?? [],
      };

    case "GRID":
      return {
        type: "GRID",
        ITEMS: (c.ITEMS as { NUM: string; LABEL: string; TITLE: string; BODY: string }[]) ?? [],
      };

    case "CALLOUT":
      return {
        type: "CALLOUT",
        STYLE: (c.STYLE as "gold" | "red") ?? "gold",
        TEXT: (c.TEXT as string) ?? "",
      };

    case "PULL_QUOTE":
      return {
        type: "PULL_QUOTE",
        TEXT: (c.TEXT as string) ?? "",
      };

    default:
      console.warn("[parseBlogYaml] Unknown component type:", type);
      return null;
  }
}

export function parseBlogYaml(raw: string): BlogPost {
  const doc = yaml.load(raw) as Record<string, unknown>;

  const rawSections = (doc.SECTIONS ?? []) as Record<string, unknown>[];

  const sections: BlogSection[] = rawSections.map((item) => {
    const s = (item as Record<string, unknown>).SECTION as Record<string, unknown>;
    const rawComponents = (s.COMPONENTS ?? []) as Record<string, unknown>[];

    const components = rawComponents
      .map(normaliseComponent)
      .filter((c): c is BlogComponent => c !== null);

    return {
      SECTION: {
        NUM: (s.NUM as string) ?? "",
        TITLE: (s.TITLE as string) ?? "",
        DROP_CAP: Boolean(s.DROP_CAP),
        CONTENT: (s.CONTENT as string) ?? "",
        COMPONENTS: components,
      },
    };
  });

  return {
    BLOG_TITLE: (doc.BLOG_TITLE as string) ?? "",
    KICKER: (doc.KICKER as string) ?? "",
    SUBTITLE: (doc.SUBTITLE as string) ?? "",
    READ_TIME: (doc.READ_TIME as string) ?? "",
    TAGS: (doc.TAGS as string) ?? "",
    DATE: doc.DATE as string | undefined,
    CLOSING_QUOTE: (doc.CLOSING_QUOTE as string) ?? "",
    SECTIONS: sections,
    SIDEBAR_TOC: (doc.SIDEBAR_TOC ?? []) as { NUM: string; TITLE: string }[],
    SEO_TITLE: doc.SEO_TITLE as string | undefined,
    SEO_DESCRIPTION: doc.SEO_DESCRIPTION as string | undefined,
    OG_IMAGE: doc.OG_IMAGE as string | undefined,
  };
}