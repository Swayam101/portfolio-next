import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { YamlBlogPostModel } from "@/models/YamlBlogPost";
import { parseBlogYaml } from "@/lib/parseBlogYaml";
import { checkApiKey } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = checkApiKey(req);
  if (authError) return authError;

  try {
    await dbConnect();
    const docs = await YamlBlogPostModel.find({ active: true })
      .sort({ createdAt: -1 })
      .select("slug yaml seriesSlug seriesDescription createdAt")
      .lean();

    const seriesMap = new Map<
      string,
      {
        seriesSlug: string;
        seriesDescription: string;
        posts: {
          slug: string;
          BLOG_TITLE: string;
          createdAt: Date;
        }[];
        unparseable: number;
      }
    >();

    for (const doc of docs) {
      if (!doc.seriesSlug) continue;

      try {
        const post = parseBlogYaml(doc.yaml);
        const existing = seriesMap.get(doc.seriesSlug);
        if (existing) {
          existing.posts.push({
            slug: doc.slug,
            BLOG_TITLE: post.BLOG_TITLE,
            createdAt: doc.createdAt,
          });
        } else {
          seriesMap.set(doc.seriesSlug, {
            seriesSlug: doc.seriesSlug,
            seriesDescription: doc.seriesDescription || "",
            posts: [
              {
                slug: doc.slug,
                BLOG_TITLE: post.BLOG_TITLE,
                createdAt: doc.createdAt,
              },
            ],
            unparseable: 0,
          });
        }
      } catch {
        // Track unparseable posts in the series
        const existing = seriesMap.get(doc.seriesSlug);
        if (existing) {
          existing.unparseable++;
        } else {
          seriesMap.set(doc.seriesSlug, {
            seriesSlug: doc.seriesSlug,
            seriesDescription: doc.seriesDescription || "",
            posts: [],
            unparseable: 1,
          });
        }
      }
    }

    const series = Array.from(seriesMap.values()).map((group) => ({
      seriesSlug: group.seriesSlug,
      seriesDescription: group.seriesDescription,
      postCount: group.posts.length,
      unparseableCount: group.unparseable,
      posts: [...group.posts]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map(({ slug, BLOG_TITLE }) => ({ slug, BLOG_TITLE })),
    }));

    return NextResponse.json({ series });
  } catch (error) {
    console.error("[API /api/blog/series] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
