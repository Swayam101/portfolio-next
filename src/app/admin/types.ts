export interface Post {
  slug: string;
  BLOG_TITLE: string;
  KICKER: string;
  SUBTITLE: string;
  tags?: string;
  readTime?: string;
  date?: string;
  category?: string;
  seriesSlug?: string;
  active: boolean;
}

export interface Series {
  seriesSlug: string;
  seriesDescription: string;
  postCount: number;
  unparseableCount: number;
  posts: { slug: string; BLOG_TITLE: string }[];
}

export interface RawPost {
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
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type View = "dashboard" | "editor" | "series" | "generate";

export interface Toast {
  message: string;
  type: "success" | "error";
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: string;
}
