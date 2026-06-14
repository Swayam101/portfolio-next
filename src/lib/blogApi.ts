import dbConnect from "./dbConnect";
import { parseBlogYaml } from "./parseBlogYaml";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import type { BlogPost, BlogPostWithSlug } from "@/types/blog";

export async function getPostSlugs(): Promise<string[]> {
  try {
    await dbConnect();
    const posts = await YamlBlogPostModel.find({}, { slug: 1 }).lean();
    return posts.map((p) => p.slug);
  } catch (error) {
    console.error("Failed to fetch slugs from MongoDB:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    await dbConnect();
    const realSlug = slug.replace(/\.yaml$/, "");
    const doc = await YamlBlogPostModel.findOne({ slug: realSlug }).lean();
    if (!doc) return null;

    return parseBlogYaml(doc.yaml);
  } catch (error) {
    console.error(`Failed to fetch post for slug ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPostWithSlug[]> {
  try {
    await dbConnect();
    const docs = await YamlBlogPostModel.find({}).sort({ createdAt: -1 }).lean();

    const validPosts: BlogPostWithSlug[] = [];

    for (const doc of docs) {
      try {
        const post = parseBlogYaml(doc.yaml);
        validPosts.push({
          ...post,
          slug: doc.slug,
        });
      } catch (err) {
        console.error(`Failed to parse YAML for slug ${doc.slug}:`, err);
      }
    }

    return validPosts;
  } catch (error) {
    console.error("Failed to fetch all posts:", error);
    return [];
  }
}
