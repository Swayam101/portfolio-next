import Link from "next/link";
import { getPostsCatalog } from "@/lib/blogApi";
import { BlogPostListItem } from "@/components/blog/BlogPostListItem";
import { formatSeriesTitle } from "@/components/blog/BlogSeriesNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Technology & Computing, Explained | Swayam",
  description:
    "Stories about technology, computer science, and the software that shapes the world — written for curious people, not just developers.",
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  const catalog = await getPostsCatalog();
  const totalPosts =
    catalog.standalone.length +
    catalog.series.reduce((count, group) => count + group.posts.length, 0);
  const isEmpty = totalPosts === 0;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#f2fafa",
        color: "#1a2e3b",
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      <header className="bg-[#1a2e3b] border-b-[3px] border-[#5bbfbf]">
        <div className="flex items-center justify-between px-5 sm:px-8 lg:px-14 py-3 border-b border-[rgba(91,191,191,0.2)]">
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8dd9d9] no-underline hover:text-white transition-colors duration-150"
          >
            ← swayam.space
          </Link>
        </div>
        <div className="text-center px-5 py-[10px] font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf]">
          Swayam Prajapat &nbsp;·&nbsp; Technology &amp; Computing
        </div>
      </header>

      <section
        className="bg-[#1a2e3b] px-5 sm:px-8 lg:px-14 pt-10 sm:pt-14 pb-10 sm:pb-12 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(141,217,217,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(141,217,217,0.05) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-6 h-px bg-[#8dd9d9] shrink-0" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8dd9d9]">
            Writing
          </span>
        </div>

        <h1
          className="font-serif font-black text-[#d4f0f0] tracking-[-0.02em] m-0 mb-5"
          style={{ fontSize: "clamp(36px, 7vw, 74px)", lineHeight: 1.02 }}
        >
          Tech Stories
          <br />
          <span
            className="font-light italic"
            style={{ fontSize: "clamp(18px, 3vw, 32px)", color: "rgba(141,217,217,0.55)" }}
          >
            for curious people.
          </span>
        </h1>

        <p
          className="font-serif font-light text-[rgba(212,240,240,0.65)] leading-[1.7] max-w-[520px]"
          style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
        >
          Computer science, software history, and the ideas behind the
          technology we use every day — written so anyone can follow along.
        </p>

        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[rgba(91,191,191,0.5)] mt-5 m-0">
          {totalPosts} {totalPosts === 1 ? "essay" : "essays"} published
          {!isEmpty && catalog.series.length > 0 && (
            <> · {catalog.series.length} series</>
          )}
        </p>
      </section>

      <main className="max-w-[740px] mx-auto px-5 sm:px-8 lg:px-0 py-12 sm:py-16">
        {isEmpty ? (
          <div className="text-center py-20">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#a0c0c8] mb-2">
              Coming Soon
            </p>
            <p
              className="font-serif italic text-[#6a8a9a]"
              style={{ fontSize: "clamp(16px, 2.5vw, 20px)" }}
            >
              The first essay is on its way.
            </p>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {catalog.series.map((group) => (
              <section key={group.seriesSlug}>
                <div className="mb-6 pb-5 border-b border-[#c8e8e8]">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf] m-0 mb-2">
                    Series · {group.posts.length} {group.posts.length === 1 ? "part" : "parts"}
                  </p>
                  <h2
                    className="font-serif font-bold text-[#1a2e3b] m-0 mb-2 leading-[1.15]"
                    style={{ fontSize: "clamp(22px, 3.5vw, 30px)" }}
                  >
                    {formatSeriesTitle(group.seriesSlug)}
                  </h2>
                  {group.seriesDescription && (
                    <p
                      className="font-serif font-light italic text-[#4a6a7a] m-0 leading-[1.7] max-w-[560px]"
                      style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
                    >
                      {group.seriesDescription}
                    </p>
                  )}
                </div>

                <div className="divide-y divide-[#c8e8e8] border-l-2 border-[#5bbfbf]/25 pl-4 sm:pl-5">
                  {group.posts.map((post, index) => (
                    <BlogPostListItem
                      key={post.slug}
                      post={post}
                      partLabel={`Part ${index + 1}`}
                    />
                  ))}
                </div>
              </section>
            ))}

            {catalog.standalone.length > 0 && (
              <section>
                {catalog.series.length > 0 && (
                  <div className="mb-6 pb-5 border-b border-[#c8e8e8]">
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf] m-0 mb-2">
                      Essays
                    </p>
                    <h2
                      className="font-serif font-bold text-[#1a2e3b] m-0 leading-[1.15]"
                      style={{ fontSize: "clamp(22px, 3.5vw, 30px)" }}
                    >
                      Standalone
                    </h2>
                  </div>
                )}

                <div className="divide-y divide-[#c8e8e8]">
                  {catalog.standalone.map((post, index) => (
                    <BlogPostListItem
                      key={post.slug}
                      post={post}
                      indexWatermark={String(index + 1).padStart(2, "0")}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="bg-[#d4f0f0] border-t border-[#b8dede] px-5 sm:px-8 py-4 font-mono text-[10px] tracking-[0.12em] uppercase text-[#6a8a9a]">
        <div className="max-w-[740px] mx-auto flex flex-col sm:flex-row sm:justify-between gap-1">
          <span>Swayam Prajapat &nbsp;·&nbsp; Writing on Tech</span>
          <Link
            href="/"
            className="text-[#5bbfbf] no-underline hover:underline transition-colors"
          >
            swayam.space
          </Link>
        </div>
      </footer>
    </div>
  );
}
