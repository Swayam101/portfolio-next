import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import { parseBlogYaml } from "@/lib/parseBlogYaml";


export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    // Basic API Key protection (optional, defined in .env.local)
    // const expectedApiKey = "process.env.BLOG_API_KEY";
    // const providedApiKey = req.headers.get("x-api-key");

    // if (expectedApiKey && providedApiKey !== expectedApiKey) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();
    const { slug, yaml } = body;

    if (!slug || !yaml) {
      return NextResponse.json(
        { error: "Missing required fields: 'slug' and 'yaml'" },
        { status: 400 }
      );
    }

    // Validate the YAML against our schema
    try {
      parseBlogYaml(yaml);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Invalid YAML format", details: err.message },
        { status: 400 }
      );
    }

    await dbConnect();

    // Use findOneAndUpdate with upsert to insert or update the blog post
    const result = await YamlBlogPostModel.findOneAndUpdate(
      { slug },
      { slug, yaml, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Blog post saved successfully", slug: result.slug },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
