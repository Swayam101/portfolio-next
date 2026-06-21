import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import { parseBlogYaml } from "@/lib/parseBlogYaml";
import { revalidatePath } from "next/cache";
import { checkApiKey } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = checkApiKey(req);
  if (authError) return authError;

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const seriesFilter = searchParams.get("series")?.trim();
    const showAll = searchParams.get("all") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );

    const query: Record<string, unknown> = {};
    if (!showAll) {
      query.active = true;
    }
    if (seriesFilter) {
      query.seriesSlug = seriesFilter;
    }

    const allDocs = await YamlBlogPostModel.find(query)
      .sort({ createdAt: -1 })
      .select("slug yaml seriesSlug seriesDescription active createdAt")
      .lean();

    interface ParsedEntry {
      slug: string;
      BLOG_TITLE: string;
      TAGS: string;
      SUBTITLE: string;
      seriesSlug?: string;
      seriesDescription?: string;
      active: boolean;
      createdAt: Date;
      [key: string]: unknown;
    }

    // Parse each doc once, attach parsed data, then filter
    const parsedDocs: ParsedEntry[] = [];
    for (const doc of allDocs) {
      try {
        const post = parseBlogYaml(doc.yaml);
        parsedDocs.push({
          ...post,
          slug: doc.slug,
          seriesSlug: doc.seriesSlug || undefined,
          seriesDescription: doc.seriesDescription || undefined,
          active: doc.active,
          createdAt: doc.createdAt,
        });
      } catch {
        // skip unparseable posts
      }
    }

    // Search filter on already-parsed data (no double parse)
    let filtered = parsedDocs;
    if (search) {
      const lower = search.toLowerCase();
      filtered = parsedDocs.filter(
        (p) =>
          p.BLOG_TITLE.toLowerCase().includes(lower) ||
          p.TAGS.toLowerCase().includes(lower) ||
          p.SUBTITLE.toLowerCase().includes(lower)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginatedDocs = filtered.slice(start, start + limit);

    const seriesMap = new Map<
      string,
      {
        seriesSlug: string;
        seriesDescription: string;
        posts: ParsedEntry[];
      }
    >();
    const standalone: ParsedEntry[] = [];

    for (const doc of paginatedDocs) {
      const sSlug = doc.seriesSlug?.trim();
      if (sSlug) {
        const existing = seriesMap.get(sSlug);
        if (existing) {
          existing.posts.push(doc);
          if (!existing.seriesDescription && doc.seriesDescription) {
            existing.seriesDescription = doc.seriesDescription;
          }
        } else {
          seriesMap.set(sSlug, {
            seriesSlug: sSlug,
            seriesDescription: doc.seriesDescription ?? "",
            posts: [doc],
          });
        }
      } else {
        standalone.push(doc);
      }
    }

    const series = Array.from(seriesMap.values()).map((group) => ({
      ...group,
      posts: [...group.posts].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    }));

    return NextResponse.json({ total, page, limit, series, standalone });
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
    const { slug, yaml, seriesSlug, seriesDescription } = body;

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

    // Validate slug format: lowercase alphanumeric + hyphens only
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Invalid slug format. Use lowercase letters, numbers, and hyphens only (e.g. 'my-new-post')",
        },
        { status: 400 }
      );
    }

    // Validate the YAML against our schema
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

    await dbConnect();

    // Check if an existing post with this slug exists (for series cleanup)
    const existing = await YamlBlogPostModel.findOne({ slug })
      .select("seriesSlug")
      .lean();

    const update: Record<string, string> = { slug, yaml };
    if (typeof seriesSlug === "string" && seriesSlug.trim()) {
      update.seriesSlug = seriesSlug.trim();
    }
    if (typeof seriesDescription === "string" && seriesDescription.trim()) {
      update.seriesDescription = seriesDescription.trim();
    }

    // Upsert the post — new posts default to active: true
    const result = await YamlBlogPostModel.findOneAndUpdate(
      { slug },
      { $set: update, $setOnInsert: { active: true } },
      { upsert: true, new: true }
    );

    // If the post changed series or left a series, clean up the old series
    if (existing?.seriesSlug) {
      const oldSeriesSlug = existing.seriesSlug;
      const newSeriesSlug =
        typeof seriesSlug === "string" && seriesSlug.trim()
          ? seriesSlug.trim()
          : undefined;

      if (oldSeriesSlug !== newSeriesSlug) {
        // Check if any other posts still reference the old series
        const remaining = await YamlBlogPostModel.countDocuments({
          seriesSlug: oldSeriesSlug,
          slug: { $ne: slug },
        });

        if (remaining === 0) {
          await YamlBlogPostModel.updateMany(
            { seriesSlug: oldSeriesSlug, slug: { $ne: slug } },
            { $unset: { seriesSlug: "", seriesDescription: "" } }
          );
        }
      }
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

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
