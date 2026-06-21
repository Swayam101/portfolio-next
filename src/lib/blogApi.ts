import dbConnect from "./dbConnect";
import { parseBlogYaml } from "./parseBlogYaml";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import type {
  BlogCatalog,
  BlogPostWithSlug,
  BlogSeriesGroup,
  YamlBlogPost,
} from "@/types/blog";

type LeanYamlBlogPost = Pick<
  YamlBlogPost,
  "slug" | "yaml" | "seriesSlug" | "seriesDescription" | "active" | "createdAt"
>;

function docToPost(doc: LeanYamlBlogPost): BlogPostWithSlug | null {
  try {
    const post = parseBlogYaml(doc.yaml);
    return {
      ...post,
      slug: doc.slug,
      seriesSlug: doc.seriesSlug || undefined,
      seriesDescription: doc.seriesDescription || undefined,
    };
  } catch (err) {
    console.error(`[blogApi] Failed to parse YAML for slug ${doc.slug}:`, err);
    return null;
  }
}

function buildCatalog(docs: LeanYamlBlogPost[]): BlogCatalog {
  const createdAtBySlug = new Map(docs.map((doc) => [doc.slug, doc.createdAt]));
  const seriesMap = new Map<string, BlogSeriesGroup>();
  const standalone: BlogPostWithSlug[] = [];

  for (const doc of docs) {
    const post = docToPost(doc);
    if (!post) continue;

    const seriesSlug = post.seriesSlug?.trim();
    if (seriesSlug) {
      const existing = seriesMap.get(seriesSlug);
      if (existing) {
        existing.posts.push(post);
        if (!existing.seriesDescription && post.seriesDescription) {
          existing.seriesDescription = post.seriesDescription;
        }
      } else {
        seriesMap.set(seriesSlug, {
          seriesSlug,
          seriesDescription: post.seriesDescription ?? "",
          posts: [post],
        });
      }
    } else {
      standalone.push(post);
    }
  }

  const series = Array.from(seriesMap.values()).map((group) => ({
    ...group,
    posts: [...group.posts].sort(
      (a, b) =>
        new Date(createdAtBySlug.get(a.slug) ?? 0).getTime() -
        new Date(createdAtBySlug.get(b.slug) ?? 0).getTime()
    ),
  }));

  return { series, standalone };
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    console.log("[blogApi] Fetching post slugs from MongoDB...");
    await dbConnect();
    const posts = await YamlBlogPostModel.find({ active: true }, { slug: 1 }).lean();
    console.log(`[blogApi] Successfully fetched ${posts.length} slug(s).`);
    return posts.map((p) => p.slug);
  } catch (error) {
    console.error("Failed to fetch slugs from MongoDB:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithSlug | null> {
  try {
    console.log(`[blogApi] Fetching post by slug: "${slug}"`);
    await dbConnect();
    const realSlug = slug.replace(/\.yaml$/, "");
    const doc = await YamlBlogPostModel.findOne({ slug: realSlug, active: true }).lean();
    if (!doc) {
      console.log(`[blogApi] No active document found for slug: "${realSlug}"`);
      return null;
    }

    console.log(`[blogApi] Document found for slug: "${realSlug}". Parsing YAML...`);
    const post = docToPost(doc);
    if (post) {
      console.log(`[blogApi] Successfully parsed YAML for slug: "${realSlug}"`);
    }
    return post;
  } catch (error) {
    console.error(`Failed to fetch post for slug ${slug}:`, error);
    return null;
  }
}

/** Structured catalog: series groups + standalone posts (both newest-first at top level). */
export async function getPostsCatalog(): Promise<BlogCatalog> {
  try {
    console.log("[blogApi] Fetching all posts from MongoDB...");
    await dbConnect();
    const docs = await YamlBlogPostModel.find({ active: true })
      .sort({ createdAt: -1 })
      .select("slug yaml seriesSlug seriesDescription createdAt")
      .lean();
    console.log(`[blogApi] Found ${docs.length} document(s) in DB.`);

    const catalog = buildCatalog(docs);
    const totalPosts = catalog.standalone.length + catalog.series.reduce((n, g) => n + g.posts.length, 0);
    console.log(
      `[blogApi] Returning catalog with ${catalog.series.length} series and ${catalog.standalone.length} standalone post(s) (${totalPosts} total).`
    );
    return catalog;
  } catch (error) {
    console.error("Failed to fetch posts catalog:", error);
    return { series: [], standalone: [] };
  }
}

/** All posts in a series, in reading order (oldest first). */
export async function getPostsBySeriesSlug(seriesSlug: string): Promise<BlogSeriesGroup | null> {
  try {
    await dbConnect();
    const docs = await YamlBlogPostModel.find({ seriesSlug, active: true })
      .sort({ createdAt: 1 })
      .select("slug yaml seriesSlug seriesDescription createdAt")
      .lean();

    if (docs.length === 0) return null;

    const posts = docs.map(docToPost).filter((p): p is BlogPostWithSlug => p !== null);
    if (posts.length === 0) return null;

    return {
      seriesSlug,
      seriesDescription: posts.find((p) => p.seriesDescription)?.seriesDescription ?? "",
      posts,
    };
  } catch (error) {
    console.error(`Failed to fetch series ${seriesSlug}:`, error);
    return null;
  }
}
