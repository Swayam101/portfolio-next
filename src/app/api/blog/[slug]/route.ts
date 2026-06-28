import { NextRequest, NextResponse } from "next/server";
import { parseBlogYaml } from "@/features/blog/parseYaml";
import { revalidatePath } from "next/cache";
import { checkApiKey } from "@/lib/adminAuth";
import { getRawPost, togglePostActive } from "@/features/blog/db";

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

    try {
      const post = parseBlogYaml(doc.yaml);
      return NextResponse.json({
        ...post,
        slug: doc.slug,
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
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "YAML parse error";
      return NextResponse.json(
        { error: "Failed to parse stored YAML", details: message, slug },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error(`[API /api/blog/${slug}] Error:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authError = checkApiKey(_req);
  if (authError) return authError;

  try {
    const body = await _req.json();
    const { active } = body;

    if (typeof active !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid 'active' field (must be boolean)" },
        { status: 400 }
      );
    }

    const success = await togglePostActive(slug, active);
    if (!success) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({
      message: active ? "Post activated" : "Post deactivated",
      slug,
      active,
    });
  } catch (error) {
    console.error(`[API /api/blog/${slug}] PATCH error:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
