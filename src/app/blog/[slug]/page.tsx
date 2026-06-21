import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs, getPostsBySeriesSlug } from "@/lib/blogApi";
import { BlogPage } from "@/components/blog/BlogPage";
import type { Metadata } from "next";

import "../../blog.css";

const BASE_URL = "https://www.swayam.space";

export const revalidate = 300; // 5 minutes

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) {
      return { title: "Post Not Found | Swayam" };
    }
    
    const title = post.SEO_TITLE || `${post.BLOG_TITLE} | Swayam`;
    const description = post.SEO_DESCRIPTION || post.SUBTITLE;
    const ogImage = post.OG_IMAGE ?? null;

    return {
      title,
      description,
      openGraph: {
        type: "article",
        title,
        description,
        url: `${BASE_URL}/blog/${slug}`,
        siteName: "Swayam",
        images: ogImage ? [{ url: ogImage }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: "@SPrajapat16530",
        images: ogImage ? [ogImage] : [],
      },
      alternates: {
        canonical: `${BASE_URL}/blog/${slug}`,
      },
    };
  } catch {
    return { title: "Post Not Found | Swayam" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  let post;
  let series = null;
  try {
    post = await getPostBySlug(slug);
    if (!post) notFound();
    if (post.seriesSlug) {
      series = await getPostsBySeriesSlug(post.seriesSlug);
    }
  } catch {
    notFound();
  }

  // JSON-LD for general-audience articles — Article type
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.BLOG_TITLE,
    description: post.SUBTITLE,
    author: {
      "@type": "Person",
      name: "Swayam Prajapat",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Swayam Prajapat",
      url: BASE_URL,
    },
    datePublished: post.DATE,
    url: `${BASE_URL}/blog/${slug}`,
    mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPage post={post} series={series} />
    </>
  );
}
