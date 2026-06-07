import type { MetadataRoute } from "next";
import MY_PROJECTS from "@/data/projects";
import { getPostSlugs } from "@/lib/blogApi";

const BASE_URL = "https://www.swayam.space";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = MY_PROJECTS.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogSlugs = await getPostSlugs();
  const blogPosts = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogPosts,
    ...projects,
  ];
}
