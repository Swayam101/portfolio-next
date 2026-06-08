import Link from "next/link";
import { getAllPosts } from "@/lib/blogApi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Technology & Computing, Explained | Swayam",
  description:
    "Stories about technology, computer science, and the software that shapes the world — written for curious people, not just developers.",
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  console.log("All Posts Log : ", posts);


  return (
    <div
      className="min-h-screen"
      style={{
        background: "#f2fafa",
        color: "#1a2e3b",
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      {/* ── TOP NAV ─────────────────────────────────────────── */}
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

      {/* ── HERO STRIP ──────────────────────────────────────── */}
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
          {posts.length} {posts.length === 1 ? "essay" : "essays"} published
        </p>
      </section>

      {/* ── POST LIST ───────────────────────────────────────── */}
      <main className="max-w-[740px] mx-auto px-5 sm:px-8 lg:px-0 py-12 sm:py-16">
        {posts.length === 0 ? (
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
          <div className="divide-y divide-[#c8e8e8]">
            {posts.map((post, idx) => (
              <article key={post.slug} className="group py-9 sm:py-11 relative">
                {/* Index watermark */}
                <span
                  className="absolute right-0 top-7 font-serif font-black select-none pointer-events-none leading-none"
                  style={{
                    fontSize: "clamp(52px, 9vw, 88px)",
                    color: "#e2f3f3",
                  }}
                  aria-hidden
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[#8aaab8]">
                  <span>{post.DATE ?? "Recent"}</span>
                  <span aria-hidden>·</span>
                  <span>{post.READ_TIME}</span>
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`} className="block no-underline">
                  <h2
                    className="font-serif font-bold text-[#1a2e3b] leading-[1.15] mb-3 group-hover:text-[#2e7a7a] transition-colors duration-200 pr-12"
                    style={{ fontSize: "clamp(20px, 3.5vw, 28px)" }}
                  >
                    {post.BLOG_TITLE}
                  </h2>
                </Link>

                {/* Subtitle — the hook for general readers */}
                <p
                  className="font-serif font-light italic text-[#4a6a7a] leading-[1.7] mb-5 max-w-[560px]"
                  style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
                >
                  {post.SUBTITLE}
                </p>

                {/* Tags + Read link */}
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
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
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
