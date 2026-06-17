import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import { parseBlogYaml } from "@/lib/parseBlogYaml";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    console.log("[API /api/blog] Received POST request to create/update a blog post.");
    const expectedApiKey = process.env.BLOG_API_KEY;
    if (!expectedApiKey) {
      console.error("[API /api/blog] Error: BLOG_API_KEY is not configured in environment variables.");
      return NextResponse.json(
        { error: "Blog API is not configured" },
        { status: 503 }
      );
    }

    const providedApiKey = req.headers.get("x-api-key");
    if (providedApiKey !== expectedApiKey) {
      console.warn("[API /api/blog] Warning: Unauthorized request (invalid API key).");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, yaml } = body;

    console.log(`[API /api/blog] Processing payload for slug: "${slug}"`);

    if (!slug || !yaml) {
      console.warn("[API /api/blog] Warning: Missing required fields ('slug' or 'yaml').");
      return NextResponse.json(
        { error: "Missing required fields: 'slug' and 'yaml'" },
        { status: 400 }
      );
    }

    // Validate the YAML against our schema
    try {
      console.log(`[API /api/blog] Validating YAML for slug: "${slug}"...`);
      parseBlogYaml(yaml);
      console.log(`[API /api/blog] YAML validation successful for slug: "${slug}".`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown validation error";
      console.error(`[API /api/blog] YAML validation failed for slug "${slug}":`, message);
      return NextResponse.json(
        { error: "Invalid YAML format", details: message },
        { status: 400 }
      );
    }

    console.log("[API /api/blog] Connecting to database...");
    await dbConnect();
    console.log("[API /api/blog] Database connected. Upserting document...");

    // Use findOneAndUpdate with upsert to insert or update the blog post
    const result = await YamlBlogPostModel.findOneAndUpdate(
      { slug },
      { slug, yaml },
      { upsert: true, new: true }
    );

    console.log(`[API /api/blog] Successfully saved post with slug: "${result.slug}". Revalidating cache...`);

    // Revalidate Next.js cache so the new post appears immediately
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    console.log(`[API /api/blog] Cache revalidated. Returning success response.`);
    return NextResponse.json(
      { message: "Blog post saved successfully", slug: result.slug },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API /api/blog] Error saving blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
