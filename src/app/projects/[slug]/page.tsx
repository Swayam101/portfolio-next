import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import MY_PROJECTS from "@/data/projects";
import type { Project } from "@/types/project";

const BASE_URL = "https://www.swayam.space";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MY_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = MY_PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  const title = `${project.title} — Full-Stack Project | Swayam`;
  const description =
    project.overview?.slice(0, 155) ||
    project.description.slice(0, 155) ||
    `${project.title} — A full-stack project by Swayam Prajapat.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/projects/${project.slug}`,
      siteName: "Swayam",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/projects/${project.slug}`,
    },
  };
}

function BreadcrumbSchema({ project }: { project: Project }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: project.title,
        item: `${BASE_URL}/projects/${project.slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function SectionHeading({ num, label }: { num: string; label: string }) {
  return (
    <div
      className="flex items-center gap-3 mb-6"
      style={{
        borderBottom: "1px solid rgba(var(--pacific-blue-rgb), 0.22)",
        paddingBottom: "0.85rem",
      }}
    >
      <span
        className="font-['Bebas_Neue'] shrink-0 text-[var(--pacific-blue)]"
        style={{ fontSize: "0.78rem", letterSpacing: "0.24em" }}
      >
        {num}
      </span>
      <div
        style={{ flex: 1, height: "1px", background: "rgba(var(--pacific-blue-rgb), 0.18)" }}
      />
      <span
        className="font-['Bebas_Neue'] shrink-0 text-[var(--yale-blue)]"
        style={{ fontSize: "1rem", letterSpacing: "0.14em" }}
      >
        {label.toUpperCase()}
      </span>
    </div>
  );
}

function ProjectScreenshot({
  project,
}: {
  project: Pick<Project, "title" | "image">;
}) {
  return project.image ? (
    <div
      className="w-full overflow-hidden rounded-[6px]"
      style={{
        border: "1px solid rgba(var(--pacific-blue-rgb), 0.22)",
        boxShadow:
          "0 8px 32px rgba(var(--yale-blue-rgb), 0.12), 0 2px 6px rgba(var(--yale-blue-rgb), 0.06)",
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
        <Image
          src={project.image}
          alt={`${project.title} — project screenshot`}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  ) : (
    <div
      className="w-full overflow-hidden rounded-[6px] flex flex-col items-center justify-center gap-3"
      style={{
        aspectRatio: "16/10",
        border: "1px solid rgba(var(--pacific-blue-rgb), 0.22)",
        background:
          "repeating-linear-gradient(45deg, rgba(var(--pacific-blue-rgb),0.03) 0px, rgba(var(--pacific-blue-rgb),0.03) 1px, transparent 1px, transparent 12px)",
        backgroundColor: "rgba(var(--pacific-blue-rgb), 0.04)",
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        style={{ opacity: 0.22, color: "var(--yale-blue)" }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        className="font-['Bebas_Neue'] text-[var(--yale-blue)]/25 tracking-[0.3em]"
        style={{ fontSize: "0.72rem" }}
      >
        SCREENSHOT COMING SOON
      </span>
    </div>
  );
}

const PAGE_CSS = `
  @keyframes _pfu {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes _pdl {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  .pfu { animation: _pfu 0.82s cubic-bezier(0.22,1,0.36,1) both; }
  .pdl { transform-origin: left center; animation: _pdl 1.15s cubic-bezier(0.22,1,0.36,1) both; }
  @media (prefers-reduced-motion: reduce) {
    .pfu, .pdl { animation: none !important; }
  }
`;

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = MY_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const projectIndex = MY_PROJECTS.findIndex((p) => p.slug === slug);
  const indexLabel = String(projectIndex + 1).padStart(2, "0");
  const relatedProjects = MY_PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    author: { "@type": "Person", name: "Swayam Prajapat", url: BASE_URL },
    datePublished: project.year,
    url: `${BASE_URL}/projects/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbSchema project={project} />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <div className="min-h-screen bg-[var(--frozen-water)]">

        {/* ── Sticky header ──────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 backdrop-blur-sm border-b border-[rgba(var(--pacific-blue-rgb),0.18)]"
          style={{ backgroundColor: "rgba(190,233,232,0.92)" }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-[0.9rem]">
            <Link
              href="/"
              className="font-['Bebas_Neue'] text-xl tracking-[0.14em] text-[var(--yale-blue)] no-underline hover:text-[var(--pacific-blue)] transition-colors"
            >
              Swayam
            </Link>
            <Link
              href="/#projects"
              className="sn-pro text-sm text-[var(--yale-blue)]/60 no-underline hover:text-[var(--yale-blue)] hover:underline transition-colors"
            >
              ← Back to Crafts
            </Link>
          </div>
        </header>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto relative overflow-hidden px-6 pt-14 pb-10 sm:pt-18 sm:pb-14">

          {/* Giant watermark project number */}
          <div
            aria-hidden
            className="absolute top-0 right-0 font-['Bebas_Neue'] select-none pointer-events-none leading-none text-[var(--pacific-blue)]"
            style={{
              fontSize: "clamp(6rem, 18vw, 14rem)",
              opacity: 0.05,
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
            }}
          >
            {indexLabel}
          </div>

          {/* Breadcrumb */}
          <div className="pfu mb-8" style={{ animationDelay: "0.05s" }}>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-[0.45rem] sn-pro" style={{ fontSize: "0.82rem" }}>
                <li>
                  <Link href="/" className="text-[var(--pacific-blue)] hover:underline transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-[var(--yale-blue)]/35" aria-hidden>/</li>
                <li className="text-[var(--yale-blue)]/60">{project.title}</li>
              </ol>
            </nav>
          </div>

          {/* Two-column layout: left = info, right = screenshot */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-14">

            {/* ── LEFT: Title, meta, description, tags ─────────────── */}
            <div className="flex-1 min-w-0">

              {/* Title */}
              <h1
                className="pfu font-['Bebas_Neue'] leading-[0.9] text-[var(--yale-blue)] m-0"
                style={{
                  fontSize: "clamp(3.2rem, 8.5vw, 7rem)",
                  letterSpacing: "0.04em",
                  animationDelay: "0.14s",
                }}
              >
                {project.title}
              </h1>

              {/* Animated divider + year */}
              <div className="flex items-center gap-4 mt-4 mb-7">
                <div
                  className="pdl"
                  style={{
                    flex: 1,
                    height: "1.5px",
                    background:
                      "linear-gradient(90deg, var(--yale-blue), rgba(var(--pacific-blue-rgb),0.28))",
                    animationDelay: "0.3s",
                  }}
                />
                <span
                  className="pfu font-['Lora'] italic shrink-0 text-[var(--fresh-sky)]"
                  style={{ fontSize: "0.85rem", animationDelay: "0.52s" }}
                >
                  {project.year}
                </span>
              </div>

              {/* Description */}
              <p
                className="pfu sn-pro text-[var(--yale-blue)]/78 leading-[1.82] m-0 mb-7"
                style={{ fontSize: "1.05rem", animationDelay: "0.26s" }}
              >
                {project.description}
              </p>

              {/* Tags */}
              <div className="pfu flex flex-wrap gap-[0.4rem]" style={{ animationDelay: "0.38s" }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-['Bebas_Neue'] text-[0.72rem] tracking-[0.14em] px-3 py-[0.28rem] rounded-[2px]
                      border-[1.5px] border-[rgba(var(--pacific-blue-rgb),0.38)]
                      text-[var(--yale-blue)] bg-[rgba(var(--pacific-blue-rgb),0.07)]
                      hover:border-[var(--pacific-blue)] hover:bg-[rgba(var(--pacific-blue-rgb),0.14)]
                      transition-all duration-200 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Screenshot + action links ─────────────────── */}
            <div
              className="pfu w-full lg:w-[50%] shrink-0"
              style={{ animationDelay: "0.44s" }}
            >
              <ProjectScreenshot project={project} />

              {/* Action links below the mockup */}
              <div className="flex items-center gap-4 mt-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center font-['Bebas_Neue'] tracking-[0.16em] no-underline transition-all duration-200
                      border-[1.5px] border-[var(--yale-blue)] text-[var(--yale-blue)]
                      hover:bg-[var(--yale-blue)] hover:text-[var(--frozen-water)]
                      rounded-[3px] py-[0.5rem]"
                    style={{ fontSize: "0.82rem" }}
                  >
                    View Live ↗
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center font-['Bebas_Neue'] tracking-[0.16em] no-underline transition-all duration-200
                      border-[1.5px] border-[var(--fresh-sky)] text-[var(--fresh-sky)]
                      hover:bg-[var(--fresh-sky)] hover:text-[var(--yale-blue)]
                      rounded-[3px] py-[0.5rem]"
                    style={{ fontSize: "0.82rem" }}
                  >
                    View Repo ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Content sections ───────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-6 pb-16">

          {/* Rule between hero and body */}
          <div
            className="pdl mb-16"
            style={{
              height: "1px",
              background: "rgba(var(--pacific-blue-rgb),0.18)",
              animationDelay: "0.5s",
            }}
          />

          <div className="space-y-16">

            {/* 01 — Overview */}
            {project.overview && (
              <section className="pfu" style={{ animationDelay: "0.58s" }}>
                <SectionHeading num="01" label="Overview" />
                <p
                  className="sn-pro text-[var(--yale-blue)]/80 leading-[1.9] m-0"
                  style={{ fontSize: "1rem" }}
                >
                  {project.overview}
                </p>
              </section>
            )}

            {/* 02 — Brief & Challenge */}
            {project.brief && (
              <section className="pfu" style={{ animationDelay: "0.7s" }}>
                <SectionHeading num="02" label="Brief & Challenge" />
                <div
                  className="rounded-r-[4px] px-6 py-5"
                  style={{
                    borderLeft: "3px solid var(--pacific-blue)",
                    background: "rgba(var(--pacific-blue-rgb),0.06)",
                  }}
                >
                  <div
                    className="font-['Bebas_Neue'] text-[var(--pacific-blue)] mb-3"
                    style={{ fontSize: "0.68rem", letterSpacing: "0.24em" }}
                  >
                    CLIENT BRIEF
                  </div>
                  <p
                    className="sn-pro text-[var(--yale-blue)]/80 leading-[1.9] m-0"
                    style={{ fontSize: "1rem" }}
                  >
                    {project.brief}
                  </p>
                </div>
              </section>
            )}

            {/* 03 — Approach & Decisions */}
            {project.response && (
              <section className="pfu" style={{ animationDelay: "0.82s" }}>
                <SectionHeading num="03" label="Approach & Decisions" />
                <div
                  className="pl-5 py-[0.15rem]"
                  style={{ borderLeft: "2px solid rgba(var(--pacific-blue-rgb),0.32)" }}
                >
                  <p
                    className="sn-pro text-[var(--yale-blue)]/80 leading-[1.9] m-0"
                    style={{ fontSize: "1rem" }}
                  >
                    {project.response}
                  </p>
                </div>
              </section>
            )}

            {/* 04 — Tech Stack */}
            {project.specs && (
              <section className="pfu" style={{ animationDelay: "0.94s" }}>
                <SectionHeading num="04" label="Tech Stack" />
                <div className="flex flex-wrap gap-[0.4rem] mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-['Bebas_Neue'] text-[0.72rem] tracking-[0.14em] px-3 py-[0.28rem] rounded-[2px]
                        border-[1.5px] border-[rgba(var(--pacific-blue-rgb),0.38)]
                        text-[var(--yale-blue)] bg-[rgba(var(--pacific-blue-rgb),0.07)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p
                  className="sn-pro text-[var(--yale-blue)]/45 m-0"
                  style={{ fontSize: "0.84rem" }}
                >
                  {project.specs}
                </p>
              </section>
            )}
          </div>
        </div>

        {/* ── Footer navigation ──────────────────────────────────────── */}
        <footer
          className="max-w-3xl mx-auto px-6 pb-16"
          style={{
            borderTop: "1px solid rgba(var(--pacific-blue-rgb),0.2)",
            paddingTop: "2.5rem",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/#projects"
                className="sn-pro font-medium text-[var(--yale-blue)] no-underline hover:text-[var(--pacific-blue)] hover:underline transition-colors"
              >
                ← All Crafts
              </Link>
              <span className="text-[var(--pacific-blue)]/35">·</span>
              <Link
                href="/#contact"
                className="sn-pro font-medium text-[var(--yale-blue)] no-underline hover:text-[var(--pacific-blue)] hover:underline transition-colors"
              >
                Get in touch →
              </Link>
            </div>

            {relatedProjects.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="sn-pro text-[var(--pacific-blue)]/65"
                  style={{ fontSize: "0.82rem" }}
                >
                  More work:
                </span>
                {relatedProjects.map((p, i) => (
                  <span key={p.slug}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="sn-pro text-[var(--yale-blue)] no-underline hover:underline"
                    >
                      {p.title}
                    </Link>
                    {i < relatedProjects.length - 1 && (
                      <span className="text-[var(--pacific-blue)]/35 mx-1">,</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}
