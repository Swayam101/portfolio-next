import Link from "next/link";
import type { BlogPostWithSlug } from "@/types/blog";

interface Props {
  post: BlogPostWithSlug;
  partLabel?: string;
  indexWatermark?: string;
}

export function BlogPostListItem({ post, partLabel, indexWatermark }: Props) {
  return (
    <article className="group py-9 sm:py-11 relative">
      {indexWatermark && (
        <span
          className="absolute right-0 top-7 font-serif font-black select-none pointer-events-none leading-none"
          style={{
            fontSize: "clamp(52px, 9vw, 88px)",
            color: "#e2f3f3",
          }}
          aria-hidden
        >
          {indexWatermark}
        </span>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[#8aaab8]">
        {partLabel && (
          <>
            <span className="text-[#5bbfbf]">{partLabel}</span>
            <span aria-hidden>·</span>
          </>
        )}
        <span>{post.DATE ?? "Recent"}</span>
        <span aria-hidden>·</span>
        <span>{post.READ_TIME}</span>
      </div>

      <Link href={`/blog/${post.slug}`} className="block no-underline">
        <h2
          className="font-serif font-bold text-[#1a2e3b] leading-[1.15] mb-3 group-hover:text-[#2e7a7a] transition-colors duration-200 pr-12"
          style={{ fontSize: "clamp(20px, 3.5vw, 28px)" }}
        >
          {post.BLOG_TITLE}
        </h2>
      </Link>

      <p
        className="font-serif font-light italic text-[#4a6a7a] leading-[1.7] mb-5 max-w-[560px]"
        style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
      >
        {post.SUBTITLE}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(post.TAGS ?? "")
            .split("·")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1"
                style={{
                  color: "#2e7a7a",
                  background: "rgba(91,191,191,0.1)",
                  border: "1px solid rgba(91,191,191,0.28)",
                }}
              >
                {tag}
              </span>
            ))}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5bbfbf] no-underline hover:text-[#1a2e3b] transition-colors duration-150 shrink-0"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
