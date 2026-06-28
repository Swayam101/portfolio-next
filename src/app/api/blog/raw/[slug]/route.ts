import { NextRequest, NextResponse } from "next/server";
import { checkApiKey } from "@/lib/adminAuth";
import { getRawPost } from "@/features/blog/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authError = checkApiKey(_req);
  if (authError) return authError;

  try {
    const doc = await getRawPost(slug);
    if (!doc) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: doc.slug,
      yaml: doc.yaml,
      yamlHindi: doc.yamlHindi,
      yamlHinglish: doc.yamlHinglish,
      seriesSlug: doc.seriesSlug || undefined,
      seriesDescription: doc.seriesDescription || undefined,
      active: doc.active,
      tags: doc.tags,
      readTime: doc.readTime,
      date: doc.date,
      category: doc.category,
      seoTitle: doc.seoTitle,
      seoDescription: doc.seoDescription,
      ogImage: doc.ogImage,
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
