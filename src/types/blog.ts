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
  READ_TIME: string;
  TAGS: string;
  CLOSING_QUOTE: string;
  DATE?: string;
  SECTIONS: BlogSection[];
  SIDEBAR_TOC: SidebarTOCItem[];
  SEO_TITLE?: string;
  SEO_DESCRIPTION?: string;
  OG_IMAGE?: string;
}

/** MongoDB document — slug + raw YAML string */
export interface YamlBlogPost {
  slug: string;
  yaml: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Parsed blog post with URL slug */
export type BlogPostWithSlug = BlogPost & { slug: string };
