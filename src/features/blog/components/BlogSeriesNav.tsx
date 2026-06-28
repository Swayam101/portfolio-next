import Link from "next/link";
import type { BlogPostWithSlug, BlogSeriesGroup } from "@/features/blog/types";

function formatSeriesTitle(seriesSlug: string): string {
  return seriesSlug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface Props {
  currentSlug: string;
  series: BlogSeriesGroup;
}

export function BlogSeriesNav({ currentSlug, series }: Props) {
  const currentIndex = series.posts.findIndex((post) => post.slug === currentSlug);
  const partNumber = currentIndex >= 0 ? currentIndex + 1 : null;

  return (
    <aside
      className="bg-[#edf8f8] border-y border-[#b8dede] px-5 sm:px-8 lg:px-14 py-5 sm:py-6"
      aria-label="Article series navigation"
    >
      <div className="max-w-[1100px] mx-auto">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#5bbfbf] m-0 mb-2">
          Series
          {partNumber ? ` · Part ${partNumber} of ${series.posts.length}` : ""}
        </p>

        <h2
          className="font-serif font-bold text-[#1a2e3b] m-0 mb-2 leading-[1.2]"
          style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
        >
          {formatSeriesTitle(series.seriesSlug)}
        </h2>

        {series.seriesDescription && (
          <p
            className="font-serif font-light italic text-[#4a6a7a] m-0 mb-4 max-w-[640px] leading-[1.65]"
            style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
          >
            {series.seriesDescription}
          </p>
        )}

        <ol className="list-none p-0 m-0 grid gap-2 sm:grid-cols-2">
          {series.posts.map((post: BlogPostWithSlug, index) => {
            const isCurrent = post.slug === currentSlug;
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex items-start gap-3 no-underline rounded-sm px-3 py-2.5 transition-colors duration-150 ${
                    isCurrent
                      ? "bg-[#1a2e3b] text-[#d4f0f0]"
                      : "bg-[#f2fafa] text-[#2e4a5a] hover:bg-[#e2f3f3] border border-[#c8e8e8]"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.15em] uppercase shrink-0 pt-0.5 ${
                      isCurrent ? "text-[#8dd9d9]" : "text-[#5bbfbf]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block font-serif leading-snug ${
                        isCurrent ? "font-semibold text-[#d4f0f0]" : "font-medium text-[#1a2e3b]"
                      }`}
                      style={{ fontSize: "clamp(14px, 2vw, 15px)" }}
                    >
                      {post.BLOG_TITLE}
                    </span>
                    {!isCurrent && (
                      <span className="block font-mono text-[9px] tracking-[0.12em] uppercase text-[#8aaab8] mt-1">
                        {post.readTime}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

export { formatSeriesTitle };
