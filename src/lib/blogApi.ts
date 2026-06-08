import dbConnect from "./dbConnect";
import { parseBlogYaml } from "./parseBlogYaml";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import type { BlogPost } from "@/types/blog";

export async function getPostSlugs(): Promise<string[]> {
  try {
    await dbConnect();
    const posts = await YamlBlogPostModel.find({}, { slug: 1 }).lean();
    return posts.map((p: any) => p.slug);
  } catch (error) {
    console.error("Failed to fetch slugs from MongoDB:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // await dbConnect();
    const realSlug = slug.replace(/\.yaml$/, "");
    const doc = await YamlBlogPostModel.findOne({ slug: realSlug }).lean();
    if (!doc) return null;

    return parseBlogYaml((doc as any).yaml);
  } catch (error) {
    console.error(`Failed to fetch post for slug ${slug}:`, error);
    return null;
  }
}

export const dynamic = 'force-dynamic';

export async function getAllPosts(): Promise<(BlogPost & { slug: string })[]> {
  try {
    await dbConnect();
    const docs = await YamlBlogPostModel.find({}).sort({ createdAt: -1 }).lean();

    console.log("THE DOCS IN DAO : ", docs);


    const validPosts: (BlogPost & { slug: string })[] = [];

    for (const doc of docs) {
      try {
        const post = parseBlogYaml((doc as any).yaml);
        console.log("POST FROM PARSED YAML : ", post);

        validPosts.push({
          ...post,
          slug: (doc as any).slug
        });
      } catch (err) {
        console.error(`Failed to parse YAML for slug ${(doc as any).slug}:`, err);
        // Continue to the next post
      }
    }

    return validPosts;
  } catch (error) {
    console.error("Failed to fetch all posts:", error);
    return [];
  }
}
