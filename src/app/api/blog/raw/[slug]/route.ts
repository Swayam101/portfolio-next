import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import { checkApiKey } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authError = checkApiKey(_req);
  if (authError) return authError;

  try {
    await dbConnect();
    const doc = await YamlBlogPostModel.findOne({ slug })
      .select("slug yaml seriesSlug seriesDescription active createdAt updatedAt")
      .lean();
    if (!doc) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: doc.slug,
      yaml: doc.yaml,
      seriesSlug: doc.seriesSlug || undefined,
      seriesDescription: doc.seriesDescription || undefined,
      active: doc.active,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } catch (error) {
    console.error(`[API /api/blog/raw/${slug}] Error:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
