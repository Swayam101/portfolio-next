// ─────────────────────────────────────────────
//  Blog Schema Types — mirrors BLOG_SCHEMA.md
// ─────────────────────────────────────────────

export interface StatItem {
  NUM: string;
  LABEL: string;
}

export interface GridItem {
  NUM: string;   // "01", "02" …
  LABEL: string;
  TITLE: string;
  BODY: string;
}

export interface ImageComponent {
  type: "IMAGE";
  TITLE: string;
  DESCRIPTION: string;
  ASPECT: "hero" | "wide" | "square";
  PLACEMENT: "after_intro" | "after_first_para" | "end_of_section";
  /** Optional resolved URL — populate after image gen */
  SRC?: string;
}

export interface StatStripComponent {
  type: "STAT_STRIP";
  STATS: StatItem[];
}

export interface GridComponent {
  type: "GRID";
  ITEMS: GridItem[];
}

export interface CalloutComponent {
  type: "CALLOUT";
  STYLE: "gold" | "red";
  TEXT: string;
}

export interface PullQuoteComponent {
  type: "PULL_QUOTE";
  TEXT: string;
}

export type BlogComponent =
  | ImageComponent
  | StatStripComponent
  | GridComponent
  | CalloutComponent
  | PullQuoteComponent;

export interface BlogSection {
  SECTION: {
    NUM: string;           // Roman numeral — I, II, III …
    TITLE: string;
    DROP_CAP: boolean;     // true ONLY on first section
    CONTENT: string;       // Multi-paragraph prose, blank-line separated
    COMPONENTS: BlogComponent[];
  };
}

export interface SidebarTOCItem {
  NUM: string;
  TITLE: string;
}

export interface BlogPost {
  BLOG_TITLE: string;
  KICKER: string;
  SUBTITLE: string;
  CLOSING_QUOTE: string;
  SECTIONS: BlogSection[];
  SIDEBAR_TOC: SidebarTOCItem[];
}

export type BlogCategory = "people" | "anatomy" | "footnotes" | "deep-currents";

export const BLOG_CATEGORIES: { slug: BlogCategory; label: string }[] = [
  { slug: "people", label: "The People Behind" },
  { slug: "anatomy", label: "Anatomy" },
  { slug: "footnotes", label: "Footnotes" },
  { slug: "deep-currents", label: "Deep Currents" },
];

/** Metadata fields stored as separate MongoDB fields (not in YAML) */
export interface BlogMetadata {
  tags?: string;
  readTime?: string;
  date?: string;
  category?: BlogCategory;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

/** MongoDB document — slug + raw YAML string + metadata + series */
export interface YamlBlogPost {
  slug: string;
  yaml: string;
  yamlHindi?: string;
  yamlHinglish?: string;
  seriesSlug?: string;
  seriesDescription?: string;
  active: boolean;
  tags?: string;
  readTime?: string;
  date?: string;
  category?: BlogCategory;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Parsed blog post with URL slug, metadata, and series info */
export type BlogPostWithSlug = BlogPost &
  BlogMetadata & {
    slug: string;
    seriesSlug?: string;
    seriesDescription?: string;
    parsedHindi?: BlogPost;
    parsedHinglish?: BlogPost;
  };

/** A group of posts belonging to the same series */
export interface BlogSeriesGroup {
  seriesSlug: string;
  seriesDescription: string;
  posts: BlogPostWithSlug[];
}

/** A group of posts belonging to the same category */
export interface BlogCategoryGroup {
  category: BlogCategory;
  label: string;
  posts: BlogPostWithSlug[];
}

/** Structured blog index — series + standalone + category groups */
export interface BlogCatalog {
  series: BlogSeriesGroup[];
  standalone: BlogPostWithSlug[];
  categories: BlogCategoryGroup[];
}
