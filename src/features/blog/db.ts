import dbConnect from "@/lib/db/connect";
import { YamlBlogPostModel } from "./models";
import { parseBlogYaml } from "@/features/blog/parseYaml";
import type {
  BlogCatalog,
  BlogCategoryGroup,
  BlogPostWithSlug,
  BlogSeriesGroup,
  YamlBlogPost,
} from "@/features/blog/types";
import { BLOG_CATEGORIES } from "@/features/blog/types";

type LeanDoc = Pick<
  YamlBlogPost,
  "slug" | "yaml" | "yamlHindi" | "yamlHinglish" | "seriesSlug" | "seriesDescription" | "active" | "createdAt" | "tags" | "readTime" | "date" | "category" | "seoTitle" | "seoDescription" | "ogImage"
>;

const POST_FIELDS =
  "slug yaml yamlHindi yamlHinglish seriesSlug seriesDescription createdAt tags readTime date category seoTitle seoDescription ogImage";

function docToPost(doc: LeanDoc): BlogPostWithSlug | null {
  try {
    const post = parseBlogYaml(doc.yaml);
    
    let parsedHindi;
    if (doc.yamlHindi && doc.yamlHindi.trim()) {
      try { parsedHindi = parseBlogYaml(doc.yamlHindi); } catch {}
    }
    
    let parsedHinglish;
    if (doc.yamlHinglish && doc.yamlHinglish.trim()) {
      try { parsedHinglish = parseBlogYaml(doc.yamlHinglish); } catch {}
    }

    return {
      ...post,
      slug: doc.slug,
      seriesSlug: doc.seriesSlug || undefined,
      seriesDescription: doc.seriesDescription || undefined,
      parsedHindi,
      parsedHinglish,
      tags: doc.tags,
      readTime: doc.readTime,
      date: doc.date,
      category: doc.category as BlogPostWithSlug["category"],
      seoTitle: doc.seoTitle,
      seoDescription: doc.seoDescription,
      ogImage: doc.ogImage,
    };
  } catch {
    return null;
  }
}

function buildCatalog(docs: LeanDoc[]): BlogCatalog {
  const createdAtBySlug = new Map(docs.map((d) => [d.slug, d.createdAt]));
  const sortPosts = (posts: BlogPostWithSlug[]) =>
    [...posts].sort(
      (a, b) =>
        (createdAtBySlug.get(a.slug) ?? new Date(0)).getTime() -
        (createdAtBySlug.get(b.slug) ?? new Date(0)).getTime()
    );

  const seriesMap = new Map<string, BlogSeriesGroup>();
  const categoryMap = new Map<string, BlogCategoryGroup>();
  const uncategorized: BlogPostWithSlug[] = [];

  for (const doc of docs) {
    const post = docToPost(doc);
    if (!post) continue;

    const seriesSlug = post.seriesSlug?.trim();
    if (seriesSlug) {
      const group = seriesMap.get(seriesSlug);
      if (group) {
        group.posts.push(post);
        if (!group.seriesDescription && post.seriesDescription) {
          group.seriesDescription = post.seriesDescription;
        }
      } else {
        seriesMap.set(seriesSlug, {
          seriesSlug,
          seriesDescription: post.seriesDescription ?? "",
          posts: [post],
        });
      }
    } else if (post.category) {
      const group = categoryMap.get(post.category);
      if (group) {
        group.posts.push(post);
      } else {
        const meta = BLOG_CATEGORIES.find((c) => c.slug === post.category);
        categoryMap.set(post.category, {
          category: post.category,
          label: meta?.label ?? post.category,
          posts: [post],
        });
      }
    } else {
      uncategorized.push(post);
    }
  }

  return {
    series: Array.from(seriesMap.values()).map((g) => ({ ...g, posts: sortPosts(g.posts) })),
    categories: Array.from(categoryMap.values()).map((g) => ({ ...g, posts: sortPosts(g.posts) })),
    standalone: sortPosts(uncategorized),
  };
}

// ─── Public Queries ────────────────────────────────────────

export async function getPostSlugs(): Promise<string[]> {
  await dbConnect();
  const docs = await YamlBlogPostModel.find({ active: true }, { slug: 1 }).lean();
  return docs.map((d) => d.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithSlug | null> {
  await dbConnect();
  const realSlug = slug.replace(/\.yaml$/, "");
  const doc = await YamlBlogPostModel.findOne(
    { slug: realSlug, active: true },
    POST_FIELDS
  ).lean();
  return doc ? docToPost(doc) : null;
}

export async function getPostsCatalog(): Promise<BlogCatalog> {
  await dbConnect();
  const docs = await YamlBlogPostModel.find({ active: true }, POST_FIELDS)
    .sort({ createdAt: -1 })
    .lean();
  return buildCatalog(docs);
}

export async function getPostsBySeriesSlug(
  seriesSlug: string
): Promise<BlogSeriesGroup | null> {
  await dbConnect();
  const docs = await YamlBlogPostModel.find(
    { seriesSlug, active: true },
    POST_FIELDS
  )
    .sort({ createdAt: 1 })
    .lean();

  if (docs.length === 0) return null;

  const posts = docs.map(docToPost).filter((p): p is BlogPostWithSlug => p !== null);
  if (posts.length === 0) return null;

  return {
    seriesSlug,
    seriesDescription:
      posts.find((p) => p.seriesDescription)?.seriesDescription ?? "",
    posts,
  };
}

// ─── Admin Queries ─────────────────────────────────────────

export interface AdminListParams {
  search?: string;
  seriesSlug?: string;
  category?: string;
  showAll?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminListResult {
  total: number;
  page: number;
  limit: number;
  series: BlogSeriesGroup[];
  categories: BlogCategoryGroup[];
  standalone: BlogPostWithSlug[];
}

export async function listPostsForAdmin(
  params: AdminListParams
): Promise<AdminListResult> {
  await dbConnect();

  const { search, seriesSlug, category, showAll, page = 1, limit = 20 } = params;

  const match: Record<string, unknown> = {};
  if (!showAll) match.active = true;
  if (seriesSlug) match.seriesSlug = seriesSlug;
  if (category) match.category = category;

  const docs = await YamlBlogPostModel.find(match, POST_FIELDS)
    .sort({ createdAt: -1 })
    .lean();

  let parsed = docs
    .map((doc) => ({ doc, post: docToPost(doc) }))
    .filter(
      (entry): entry is { doc: LeanDoc; post: BlogPostWithSlug } =>
        entry.post !== null
    );

  if (search) {
    const q = search.toLowerCase();
    parsed = parsed.filter(
      ({ post }) =>
        post.BLOG_TITLE.toLowerCase().includes(q) ||
        (post.tags ?? "").toLowerCase().includes(q) ||
        post.SUBTITLE.toLowerCase().includes(q)
    );
  }

  const total = parsed.length;
  const start = (page - 1) * limit;
  const pageDocs = parsed.slice(start, start + limit).map((e) => e.doc);

  const catalog = buildCatalog(pageDocs);
  return { total, page, limit, ...catalog };
}

export async function upsertPost(
  slug: string,
  yaml: string,
  yamlHindi: string | undefined,
  yamlHinglish: string | undefined,
  metadata: Record<string, string | undefined>
): Promise<{ slug: string }> {
  await dbConnect();

  const setFields: Record<string, string> = { slug, yaml };
  const unsetFields: Record<string, "" > = {};

  if (yamlHindi && yamlHindi.trim()) setFields.yamlHindi = yamlHindi;
  else unsetFields.yamlHindi = "";

  if (yamlHinglish && yamlHinglish.trim()) setFields.yamlHinglish = yamlHinglish;
  else unsetFields.yamlHinglish = "";

  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined) continue;
    if (value === "") {
      unsetFields[key] = "";
    } else {
      setFields[key] = value;
    }
  }

  const ops: Record<string, unknown> = {
    $set: setFields,
    $setOnInsert: { active: true },
  };
  if (Object.keys(unsetFields).length > 0) {
    ops.$unset = unsetFields;
  }

  const result = await YamlBlogPostModel.findOneAndUpdate(
    { slug },
    ops,
    { upsert: true, new: true }
  );

  return { slug: result.slug };
}

export async function getExistingSeriesSlug(
  slug: string
): Promise<string | undefined> {
  await dbConnect();
  const doc = await YamlBlogPostModel.findOne({ slug }, { seriesSlug: 1 }).lean();
  return doc?.seriesSlug || undefined;
}

export async function cleanupOrphanedSeries(
  oldSeriesSlug: string,
  excludeSlug: string
): Promise<void> {
  await dbConnect();
  const remaining = await YamlBlogPostModel.countDocuments({
    seriesSlug: oldSeriesSlug,
    slug: { $ne: excludeSlug },
  });
  if (remaining === 0) {
    await YamlBlogPostModel.updateMany(
      { seriesSlug: oldSeriesSlug, slug: { $ne: excludeSlug } },
      { $unset: { seriesSlug: "", seriesDescription: "" } }
    );
  }
}

export async function togglePostActive(
  slug: string,
  active: boolean
): Promise<boolean> {
  await dbConnect();
  const doc = await YamlBlogPostModel.findOneAndUpdate(
    { slug },
    { active },
    { new: true }
  );
  return !!doc;
}

export async function getRawPost(slug: string) {
  await dbConnect();
  return YamlBlogPostModel.findOne({ slug })
    .select(
      "slug yaml yamlHindi yamlHinglish seriesSlug seriesDescription active createdAt updatedAt tags readTime date category seoTitle seoDescription ogImage"
    )
    .lean();
}
