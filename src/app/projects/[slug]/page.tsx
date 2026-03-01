import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import MY_PROJECTS from "@/data/projects";
import type { Project } from "@/types/project";

const BASE_URL = "https://www.swayam.space";

/** ISR: Revalidate project pages every 60 seconds when content changes */
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

/** Breadcrumb schema: Home > Project (no intermediate "Projects" — that section lives on homepage) */
function BreadcrumbSchema({ project }: { project: Project }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: project.title, item: `${BASE_URL}/projects/${project.slug}` },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = MY_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    author: { "@type": "Person", name: "Swayam Prajapat", url: BASE_URL },
    datePublished: project.year,
    url: `${BASE_URL}/projects/${project.slug}`,
  };

  const relatedProjects = MY_PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbSchema project={project} />

      <div className="min-h-screen bg-[var(--frozen-water)]">
        {/* Page header — matches site nav style */}
        <header
          className="sticky top-0 z-50 bg-[var(--frozen-water)]/95 backdrop-blur-sm border-b border-[rgba(var(--pacific-blue-rgb),0.2)]"
          style={{ padding: "1rem 1.5rem" }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="font-['Bebas_Neue'] text-xl tracking-[0.12em] text-[var(--yale-blue)] no-underline hover:text-[var(--pacific-blue)] transition-colors"
            >
              Swayam
            </Link>
            <Link
              href="/#projects"
              className="sn-pro text-sm text-[var(--pacific-blue)] no-underline hover:underline"
            >
              ← Back to Crafts
            </Link>
          </div>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
          {/* Breadcrumb — Home / Project (no fake intermediate page) */}
          <nav className="mb-10 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[var(--pacific-blue)]">
              <li>
                <Link href="/" className="hover:underline hover:text-[var(--yale-blue)]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-[var(--yale-blue)] font-medium">{project.title}</li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <h1
              className="font-['Bebas_Neue'] text-4xl sm:text-5xl md:text-6xl leading-tight tracking-[0.04em] text-[var(--yale-blue)] mb-3"
              style={{ letterSpacing: "0.05em" }}
            >
              {project.title}
            </h1>
            <p className="sn-pro text-[var(--fresh-sky)] italic">{project.year}</p>
          </header>

          {/* Short description */}
          <p className="sn-pro text-lg text-[var(--yale-blue)] leading-relaxed mb-12 max-w-2xl">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-14">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-['Bebas_Neue'] text-[0.7rem] tracking-[0.12em] px-3 py-1.5 rounded-[2px] border border-[var(--pacific-blue)] text-[var(--yale-blue)] bg-[rgba(var(--pacific-blue-rgb),0.08)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action links */}
          <div className="flex flex-wrap gap-6 mb-16 pb-12 border-b border-[rgba(var(--pacific-blue-rgb),0.25)]">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Bebas_Neue'] text-[0.8rem] tracking-[0.18em] text-[var(--yale-blue)] no-underline inline-flex items-center gap-2 hover:text-[var(--pacific-blue)] transition-colors"
              >
                View Live
                <span aria-hidden>→</span>
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Bebas_Neue'] text-[0.8rem] tracking-[0.18em] text-[var(--fresh-sky)] no-underline inline-flex items-center gap-2 hover:text-[var(--pacific-blue)] transition-colors"
              >
                View Repo
                <span aria-hidden>→</span>
              </a>
            )}
          </div>

          {/* Content sections */}
          <div className="space-y-12">
            {project.overview && (
              <section>
                <h2 className="font-['Bebas_Neue'] text-2xl tracking-[0.06em] text-[var(--yale-blue)] mb-4">
                  Overview
                </h2>
                <p className="sn-pro text-[var(--yale-blue)] leading-[1.8]">
                  {project.overview}
                </p>
              </section>
            )}

            {project.brief && (
              <section>
                <h2 className="font-['Bebas_Neue'] text-2xl tracking-[0.06em] text-[var(--yale-blue)] mb-4">
                  Brief & Challenge
                </h2>
                <p className="sn-pro text-[var(--yale-blue)] leading-[1.8]">
                  {project.brief}
                </p>
              </section>
            )}

            {project.response && (
              <section>
                <h2 className="font-['Bebas_Neue'] text-2xl tracking-[0.06em] text-[var(--yale-blue)] mb-4">
                  Approach & Decisions
                </h2>
                <p className="sn-pro text-[var(--yale-blue)] leading-[1.8]">
                  {project.response}
                </p>
              </section>
            )}

            {project.specs && (
              <section>
                <h3 className="font-['Bebas_Neue'] text-xl tracking-[0.06em] text-[var(--pacific-blue)] mb-2">
                  Tech Stack
                </h3>
                <p className="sn-pro text-[var(--yale-blue)]">{project.specs}</p>
              </section>
            )}
          </div>

          {/* Footer — navigation & related */}
          <footer className="mt-20 pt-10 border-t border-[rgba(var(--pacific-blue-rgb),0.25)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#projects"
                  className="sn-pro text-[var(--yale-blue)] font-medium hover:text-[var(--pacific-blue)] hover:underline"
                >
                  ← All Crafts
                </Link>
                <span className="text-[var(--pacific-blue)]/50">·</span>
                <Link
                  href="/#contact"
                  className="sn-pro text-[var(--yale-blue)] font-medium hover:text-[var(--pacific-blue)] hover:underline"
                >
                  Get in touch →
                </Link>
              </div>
              {relatedProjects.length > 0 && (
                <div>
                  <span className="sn-pro text-sm text-[var(--pacific-blue)]/80 mr-2">
                    More work:
                  </span>
                  {relatedProjects.map((p, i) => (
                    <span key={p.slug}>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="sn-pro text-[var(--yale-blue)] hover:underline"
                      >
                        {p.title}
                      </Link>
                      {i < relatedProjects.length - 1 && (
                        <span className="text-[var(--pacific-blue)]/50 mx-1">,</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
