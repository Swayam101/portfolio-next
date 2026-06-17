import dbConnect from "./dbConnect";
import { parseBlogYaml } from "./parseBlogYaml";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import type { BlogPost, BlogPostWithSlug } from "@/types/blog";

export async function getPostSlugs(): Promise<string[]> {
  try {
    console.log("[blogApi] Fetching post slugs from MongoDB...");
    await dbConnect();
    const posts = await YamlBlogPostModel.find({}, { slug: 1 }).lean();
    console.log(`[blogApi] Successfully fetched ${posts.length} slug(s).`);
    return posts.map((p) => p.slug);
  } catch (error) {
    console.error("Failed to fetch slugs from MongoDB:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log(`[blogApi] Fetching post by slug: "${slug}"`);
    await dbConnect();
    const realSlug = slug.replace(/\.yaml$/, "");
    const doc = await YamlBlogPostModel.findOne({ slug: realSlug }).lean();
    if (!doc) {
      console.log(`[blogApi] No document found for slug: "${realSlug}"`);
      return null;
    }

    console.log(`[blogApi] Document found for slug: "${realSlug}". Parsing YAML...`);
    const parsed = parseBlogYaml(doc.yaml);
    console.log(`[blogApi] Successfully parsed YAML for slug: "${realSlug}"`);
    return parsed;
  } catch (error) {
    console.error(`Failed to fetch post for slug ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPostWithSlug[]> {
  try {
    console.log("[blogApi] Fetching all posts from MongoDB...");
    await dbConnect();
    const docs = await YamlBlogPostModel.find({}).sort({ createdAt: -1 }).lean();
    console.log(`[blogApi] Found ${docs.length} document(s) in DB.`);

    const validPosts: BlogPostWithSlug[] = [];

    for (const doc of docs) {
      try {
        const post = parseBlogYaml(doc.yaml);
        validPosts.push({
          ...post,
          slug: doc.slug,
        });
      } catch (err) {
        console.error(`[blogApi] Failed to parse YAML for slug ${doc.slug}:`, err);
      }
    }

    console.log(`[blogApi] Returning ${validPosts.length} valid post(s).`);
    return validPosts;
  } catch (error) {
    console.error("Failed to fetch all posts:", error);
    return [];
  }
}
