import { NextRequest, NextResponse } from "next/server";
import { checkApiKey } from "@/lib/adminAuth";
import { getPostsBySeriesSlug } from "@/features/blog/db";
import dbConnect from "@/lib/db/connect";
import { YamlBlogPostModel } from "@/features/blog/models";
import { parseBlogYaml } from "@/features/blog/parseYaml";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = checkApiKey(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const seriesSlug = searchParams.get("series")?.trim();

    if (seriesSlug) {
      const group = await getPostsBySeriesSlug(seriesSlug);
      if (!group) {
        return NextResponse.json({ series: [] });
      }
      return NextResponse.json({
        series: [
          {
            seriesSlug: group.seriesSlug,
            seriesDescription: group.seriesDescription,
            postCount: group.posts.length,
            unparseableCount: 0,
            posts: group.posts.map((p) => ({
              slug: p.slug,
              BLOG_TITLE: p.BLOG_TITLE,
            })),
          },
        ],
      });
    }

    // All series
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
        posts: { slug: string; BLOG_TITLE: string; createdAt: Date }[];
        unparseable: number;
      }
    >();

    for (const doc of docs) {
      if (!doc.seriesSlug) continue;
      try {
        const post = parseBlogYaml(doc.yaml);
        const existing = seriesMap.get(doc.seriesSlug);
        const entry = { slug: doc.slug, BLOG_TITLE: post.BLOG_TITLE, createdAt: doc.createdAt };
        if (existing) {
          existing.posts.push(entry);
        } else {
          seriesMap.set(doc.seriesSlug, {
            seriesSlug: doc.seriesSlug,
            seriesDescription: doc.seriesDescription || "",
            posts: [entry],
            unparseable: 0,
          });
        }
      } catch {
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

    const series = Array.from(seriesMap.values())
      .sort((a, b) => {
        const aDate = a.posts[0]?.createdAt ?? new Date(0);
        const bDate = b.posts[0]?.createdAt ?? new Date(0);
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .map(({ posts, ...rest }) => ({
        ...rest,
        postCount: posts.length,
        posts: posts
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
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
