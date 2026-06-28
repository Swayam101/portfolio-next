import { NextRequest, NextResponse } from "next/server";
import { parseBlogYaml } from "@/features/blog/parseYaml";
import { revalidatePath } from "next/cache";
import { checkApiKey } from "@/lib/adminAuth";
import { BLOG_CATEGORIES } from "@/features/blog/types";
import {
  listPostsForAdmin,
  upsertPost,
  getExistingSeriesSlug,
  cleanupOrphanedSeries,
} from "@/features/blog/db";

const VALID_CATEGORIES = BLOG_CATEGORIES.map((c) => c.slug);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = checkApiKey(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || undefined;
    const seriesFilter = searchParams.get("series")?.trim() || undefined;
    const categoryFilter = searchParams.get("category")?.trim() || undefined;
    const showAll = searchParams.get("all") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );

    if (
      categoryFilter &&
      !VALID_CATEGORIES.includes(categoryFilter as (typeof VALID_CATEGORIES)[number])
    ) {
      return NextResponse.json(
        { error: "Invalid category filter" },
        { status: 400 }
      );
    }

    const result = await listPostsForAdmin({
      search,
      seriesSlug: seriesFilter,
      category: categoryFilter,
      showAll,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /api/blog] Error listing posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = checkApiKey(req);
    if (authError) return authError;

    const body = await req.json();
    const { slug, yaml, seriesSlug, seriesDescription, category } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'slug' field" },
        { status: 400 }
      );
    }

    if (!yaml || typeof yaml !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'yaml' field" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Invalid slug format. Use lowercase letters, numbers, and hyphens only (e.g. 'my-new-post')",
        },
        { status: 400 }
      );
    }

    try {
      parseBlogYaml(yaml);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown validation error";
      return NextResponse.json(
        { error: "Invalid YAML format", details: message },
        { status: 400 }
      );
    }

    if (
      typeof category === "string" &&
      category !== "" &&
      !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid category. Must be one of: " + VALID_CATEGORIES.join(", "),
        },
        { status: 400 }
      );
    }

    const oldSeriesSlug = await getExistingSeriesSlug(slug);

    const metadata: Record<string, string | undefined> = {
      tags: body.tags,
      readTime: body.readTime,
      date: body.date,
      category: body.category,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      ogImage: body.ogImage,
    };
    if (typeof seriesSlug === "string" && seriesSlug.trim()) {
      metadata.seriesSlug = seriesSlug.trim();
    }
    if (typeof seriesDescription === "string" && seriesDescription.trim()) {
      metadata.seriesDescription = seriesDescription.trim();
    }

    await upsertPost(slug, yaml, metadata);

    if (oldSeriesSlug) {
      const newSeriesSlug =
        typeof seriesSlug === "string" && seriesSlug.trim()
          ? seriesSlug.trim()
          : undefined;
      if (oldSeriesSlug !== newSeriesSlug) {
        await cleanupOrphanedSeries(oldSeriesSlug, slug);
      }
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json(
      { message: "Blog post saved successfully", slug },
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
